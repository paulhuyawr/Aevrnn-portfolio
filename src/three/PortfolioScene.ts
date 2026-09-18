import * as THREE from 'three';
import { PORTFOLIO_DATA, ProjectItem } from '../data/portfolioData';
import { createProjectCardTexture, createLogoTexture } from './TextureGenerator';
import { ambientSynth } from '../utils/audioEngine';

export interface SceneCallbacks {
  onCardSelect: (project: ProjectItem) => void;
  onActiveSectionChange: (index: number, project: ProjectItem | null) => void;
  onProgressUpdate: (progress: number) => void;
}

interface Card3DNode {
  mesh: THREE.Group;
  project: ProjectItem;
  index: number;
  screenMesh: THREE.Mesh;
  frameMesh: THREE.LineSegments;
  // Specific entry, trailing mid-flight, focal & exit motion parameters
  entryOffset: THREE.Vector3;
  entryRotation: THREE.Euler;
  midOffset: THREE.Vector3;
  midRotation: THREE.Euler;
  focalPosition: THREE.Vector3;
  focalRotation: THREE.Euler;
  exitOffset: THREE.Vector3;
  exitRotation: THREE.Euler;
  currentOpacity: number;
}

export class PortfolioScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animationFrameId: number = 0;
  private isDestroyed: boolean = false;

  // Scroll & Animation Physics
  private targetProgress: number = 0;
  private currentProgress: number = 0;
  private totalNodes: number = PORTFOLIO_DATA.length + 1; // 0 is Intro Logo, 1..N are cards

  // Mouse Parallax
  private targetMouse = { x: 0, y: 0 };
  private currentMouse = { x: 0, y: 0 };

  // 3D Objects
  private orbGroup!: THREE.Group;
  private orbCore!: THREE.Mesh;
  private orbShell1!: THREE.Mesh;
  private orbShell2!: THREE.Mesh;
  private orbRings: THREE.Mesh[] = [];
  private orbFragments: THREE.Mesh[] = [];
  private logoMesh!: THREE.Mesh;
  private particleSystem!: THREE.Points;
  private gridHelper!: THREE.GridHelper;
  private backgroundGroup!: THREE.Group;

  // Cards
  private cards: Card3DNode[] = [];
  private raycaster = new THREE.Raycaster();
  private mouseVec = new THREE.Vector2(-999, -999);
  private hoveredCard: Card3DNode | null = null;
  private lastActiveIndex: number = -1;

  // Custom visual state
  private isAutopilot: boolean = false;
  private isWireframe: boolean = false;
  private currentTheme: 'bronze' | 'cyan' | 'monochrome' = 'bronze';

  // Lights
  private coreLight: THREE.PointLight;
  private cameraLight: THREE.PointLight;
  private ambientLight: THREE.AmbientLight;

  private callbacks: SceneCallbacks;
  private isMobile: boolean = false;

  // Touch Tracking
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;
  private hasMovedMuch = false;

  constructor(container: HTMLElement, callbacks: SceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.isMobile = window.innerWidth < 768;

    // 1. Scene & Depth Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0806);
    this.scene.fog = new THREE.FogExp2(0x0b0806, 0.012);

    // 2. Camera
    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    this.camera = new THREE.PerspectiveCamera(this.isMobile ? 55 : 45, aspect, 0.1, 500);
    this.camera.position.set(0, 0, 18);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting - Walnut and Metallic Bronze
    this.ambientLight = new THREE.AmbientLight(0x2d1e15, 1.8);
    this.scene.add(this.ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe6c594, 2.2);
    dirLight1.position.set(20, 30, 25);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x825c30, 1.4);
    dirLight2.position.set(-20, -10, -15);
    this.scene.add(dirLight2);

    this.coreLight = new THREE.PointLight(0xd4af37, 4.0, 45, 1.5);
    this.coreLight.position.set(0, 0, 0);
    this.scene.add(this.coreLight);

    this.cameraLight = new THREE.PointLight(0xf3deb9, 1.5, 30, 1.8);
    this.scene.add(this.cameraLight);

    // 5. Build 3D Entities
    this.backgroundGroup = new THREE.Group();
    this.scene.add(this.backgroundGroup);

    this.createEnvironment();
    this.orbGroup = this.createCentralAEVRNNOrb();
    this.scene.add(this.orbGroup);
    this.logoMesh = this.createLogoIntroPlate();
    this.scene.add(this.logoMesh);
    this.particleSystem = this.createParticleField();
    this.scene.add(this.particleSystem);

    this.createProjectCards();

    // 6. Event Listeners
    this.setupListeners();

    // 6b. Wait for Google Web Fonts to resolve and refresh canvas textures
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (!this.isDestroyed) {
          this.refreshCardTextures();
        }
      });
    }

    // 7. Start Loop
    this.animate(0);
  }

  /**
   * Builds the massive 3D perspective grid and datum markers
   */
  private createEnvironment() {
    // Floor Grid
    this.gridHelper = new THREE.GridHelper(240, 60, 0x8c6239, 0x241810);
    this.gridHelper.position.y = -12;
    this.backgroundGroup.add(this.gridHelper);

    // Ceiling Grid
    const ceilingGrid = new THREE.GridHelper(240, 60, 0x5c3e23, 0x1a120b);
    ceilingGrid.position.y = 20;
    this.backgroundGroup.add(ceilingGrid);

    // Floating datum rings in background
    for (let i = 0; i < 4; i++) {
      const ringGeo = new THREE.RingGeometry(18 + i * 14, 18.2 + i * 14, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x8c6239,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.08 - i * 0.015,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, 0, -35 - i * 20);
      this.backgroundGroup.add(ring);
    }
  }

  /**
   * Impressive Central 3D AEVRNN Orb:
   * Metallic core + double wireframe shells + 3 orbital rings + orbiting fragments
   */
  private createCentralAEVRNNOrb(): THREE.Group {
    const group = new THREE.Group();
    group.position.set(0, 0, 0);

    // 1. Metallic Core
    const coreGeo = new THREE.IcosahedronGeometry(2.4, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x3d2719,
      roughness: 0.22,
      metalness: 0.9,
      emissive: 0x1f140c,
      emissiveIntensity: 0.4,
    });
    this.orbCore = new THREE.Mesh(coreGeo, coreMat);
    group.add(this.orbCore);

    // 2. Inner Wireframe Shell
    const shell1Geo = new THREE.IcosahedronGeometry(3.2, 1);
    const shell1Mat = new THREE.MeshBasicMaterial({
      color: 0xc59b63,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    this.orbShell1 = new THREE.Mesh(shell1Geo, shell1Mat);
    group.add(this.orbShell1);

    // 3. Outer Geodesic Wireframe Shell
    const shell2Geo = new THREE.IcosahedronGeometry(4.2, 2);
    const shell2Mat = new THREE.MeshBasicMaterial({
      color: 0xe6c594,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    this.orbShell2 = new THREE.Mesh(shell2Geo, shell2Mat);
    group.add(this.orbShell2);

    // 4. Three Bronze Orbital Rings
    const ringConfigs = [
      { radius: 5.2, tube: 0.04, tiltX: 0.8, tiltY: 0.3, color: 0xc59b63 },
      { radius: 6.4, tube: 0.035, tiltX: -0.5, tiltY: 1.1, color: 0xdfb77f },
      { radius: 7.6, tube: 0.03, tiltX: 1.4, tiltY: -0.7, color: 0x8c6239 },
    ];

    this.orbRings = ringConfigs.map((cfg) => {
      const rGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 90);
      const rMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        metalness: 0.95,
        roughness: 0.2,
      });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.rotation.x = cfg.tiltX;
      rMesh.rotation.y = cfg.tiltY;
      group.add(rMesh);
      return rMesh;
    });

    // 5. Orbiting Metallic Fragments
    const fragGeo = new THREE.OctahedronGeometry(0.28, 0);
    const fragMat = new THREE.MeshStandardMaterial({
      color: 0xe6c594,
      metalness: 0.85,
      roughness: 0.25,
    });

    const fragCount = this.isMobile ? 12 : 24;
    for (let i = 0; i < fragCount; i++) {
      const frag = new THREE.Mesh(fragGeo, fragMat);
      const theta = (i / fragCount) * Math.PI * 2;
      const radius = 4.0 + (i % 3) * 1.4;
      const yOff = (Math.sin(i * 1.5) * 2);
      frag.position.set(Math.cos(theta) * radius, yOff, Math.sin(theta) * radius);
      frag.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      group.add(frag);
      this.orbFragments.push(frag);
    }

    return group;
  }

  /**
   * Logo plate shown at the intro
   */
  private createLogoIntroPlate(): THREE.Mesh {
    const geo = new THREE.PlaneGeometry(7.5, 7.5);
    const mat = new THREE.MeshBasicMaterial({
      map: createLogoTexture(),
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 0, 4);
    return mesh;
  }

  /**
   * Volumetric bronze particle field
   */
  private createParticleField(): THREE.Points {
    const count = this.isMobile ? 400 : 1000;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 180;
      scales[i] = Math.random() * 0.8 + 0.3;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Custom point texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d')!;
    const rad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    rad.addColorStop(0, 'rgba(230, 197, 148, 1)');
    rad.addColorStop(0.3, 'rgba(197, 155, 99, 0.6)');
    rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = rad;
    pCtx.fillRect(0, 0, 64, 64);

    const pTex = new THREE.CanvasTexture(pCanvas);

    const pMat = new THREE.PointsMaterial({
      size: 1.4,
      map: pTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xe6c594,
    });

    return new THREE.Points(geo, pMat);
  }

  /**
   * Builds real 3D floating screens for every portfolio item
   */
  private createProjectCards() {
    const cardWidth = 7.2;
    const cardHeight = 4.5;

    PORTFOLIO_DATA.forEach((project, i) => {
      const group = new THREE.Group();
      group.name = `card-${project.id}`;

      // 1. High-DPI Canvas screen texture mapped to front plane
      const texture = createProjectCardTexture(project);
      const screenGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);
      const screenMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.35,
        metalness: 0.15,
        side: THREE.DoubleSide,
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      group.add(screenMesh);

      // 2. Thick 3D Dark Walnut Backing Box
      const backGeo = new THREE.BoxGeometry(cardWidth + 0.1, cardHeight + 0.1, 0.18);
      const backMat = new THREE.MeshStandardMaterial({
        color: 0x18100a,
        roughness: 0.45,
        metalness: 0.6,
      });
      const backMesh = new THREE.Mesh(backGeo, backMat);
      backMesh.position.z = -0.1;
      group.add(backMesh);

      // 3. Glowing Metallic Bronze Bevel Frame LineSegments
      const edgesGeo = new THREE.EdgesGeometry(backGeo);
      const edgesMat = new THREE.LineBasicMaterial({
        color: 0xc59b63,
        transparent: true,
        opacity: 0.75,
      });
      const frameMesh = new THREE.LineSegments(edgesGeo, edgesMat);
      frameMesh.position.z = -0.1;
      group.add(frameMesh);

      // Subtle backing accent light on the card
      const cardBackLight = new THREE.PointLight(0xc59b63, 0.8, 12);
      cardBackLight.position.set(0, 0, 0.4);
      group.add(cardBackLight);

      // Calculate distinct 3D flight trajectory parameters for this specific card
      // Using alternating vectors, varying heights, yaw, roll, and approach angles
      const alt = i % 2 === 0 ? 1 : -1;
      const alt3 = (i % 3) - 1; // -1, 0, 1

      // Starting far away: enters from deep background fog with a full 360-degree axial rotation
      const entryOffset = new THREE.Vector3(
        alt * (12 + (i % 3) * 1.5),
        alt3 * 4.5 + ((i % 2) - 0.5) * 1.5,
        -72 - (i % 3) * 4
      );
      // Full 360-degree spin on arrival (alt * 2 * Math.PI)
      const entryRotation = new THREE.Euler(
        alt3 * 0.12,
        alt * (Math.PI * 2.0),
        alt * 0.10
      );

      // Trailing mid-flight position: visible in deep 3D perspective behind the previous card
      const midOffset = new THREE.Vector3(
        alt * (5.5 + (i % 2) * 1.0),
        alt3 * 2.2 + ((i % 2) - 0.5) * 1.0,
        -26 - (i % 3) * 2
      );
      const midRotation = new THREE.Euler(
        alt3 * 0.06,
        alt * Math.PI,
        alt * 0.04
      );

      // Focal position: right in front of camera
      const focalPosition = new THREE.Vector3(
        alt * 0.65,
        alt3 * 0.25,
        6.5
      );
      const focalRotation = new THREE.Euler(
        alt3 * 0.02,
        -alt * 0.05,
        alt * 0.015
      );

      // Exit path: sweeps wide around camera periphery and flies behind it with full 360-degree spin
      const exitOffset = new THREE.Vector3(
        alt * (19 + (i % 3) * 2),
        -alt3 * 6,
        30 + (i % 3) * 3
      );
      // Full 360-degree spin on departure (alt * 2 * Math.PI)
      const exitRotation = new THREE.Euler(
        -alt3 * 0.2,
        alt * (Math.PI * 2.0),
        -alt * 0.15
      );

      this.scene.add(group);

      this.cards.push({
        mesh: group,
        project,
        index: i + 1, // 0 is Intro
        screenMesh,
        frameMesh,
        entryOffset,
        entryRotation,
        midOffset,
        midRotation,
        focalPosition,
        focalRotation,
        exitOffset,
        exitRotation,
        currentOpacity: 0,
      });
    });
  }

  /**
   * Set up scroll, mouse, and mobile touch listeners
   */
  private setupListeners() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('click', this.onClick);
    window.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchEnd, { passive: true });
    window.addEventListener('wheel', this.onWheel, { passive: true });
  }

  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.touchStartTime = Date.now();
      this.hasMovedMuch = false;

      // Update pointer coordinates for parallax and raycasting
      this.targetMouse.x = (this.touchStartX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(this.touchStartY / window.innerHeight) * 2 + 1;
      this.mouseVec.x = this.targetMouse.x;
      this.mouseVec.y = this.targetMouse.y;
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const diffX = touchX - this.touchStartX;
      const diffY = this.touchStartY - touchY;

      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        this.hasMovedMuch = true;
      }

      // Smooth inertia touch scroll
      const deltaY = diffY * 2.2;
      this.touchStartY = touchY;
      this.touchStartX = touchX;
      this.addScrollDelta(deltaY);

      this.targetMouse.x = (touchX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(touchY / window.innerHeight) * 2 + 1;
      this.mouseVec.x = this.targetMouse.x;
      this.mouseVec.y = this.targetMouse.y;
    }
  };

  private onTouchEnd = () => {
    const duration = Date.now() - this.touchStartTime;
    // Quick mobile tap: if user tapped directly on a 3D card without dragging
    if (!this.hasMovedMuch && duration < 350) {
      this.raycaster.setFromCamera(this.mouseVec, this.camera);
      const interactiveMeshes = this.cards
        .filter((c) => c.mesh.visible && c.currentOpacity > 0.8 && Math.abs(this.currentProgress - c.index) < 0.45)
        .map((c) => c.screenMesh);
      const intersects = this.raycaster.intersectObjects(interactiveMeshes);
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const card = this.cards.find((c) => c.screenMesh === hitMesh);
        if (card) {
          ambientSynth.playCardClick();
          ambientSynth.playInspectChime();
          this.callbacks.onCardSelect(card.project);
        }
      }
    }
  };

  private onWheel = (e: WheelEvent) => {
    this.addScrollDelta(e.deltaY);
  };

  public addScrollDelta(deltaY: number) {
    // Convert scroll delta to progress (0 to totalNodes)
    const sensitivity = 0.0020;
    this.targetProgress = Math.max(0, Math.min(this.totalNodes, this.targetProgress + deltaY * sensitivity));
  }

  public setTargetProgress(progress: number) {
    this.targetProgress = Math.max(0, Math.min(this.totalNodes, progress));
  }

  public getProgress(): number {
    return this.currentProgress;
  }

  public jumpToSection(category: string) {
    ambientSynth.playNodeWarp();
    if (category === 'intro') {
      this.targetProgress = 0;
      return;
    }
    const idx = PORTFOLIO_DATA.findIndex((p) => p.category === category);
    if (idx !== -1) {
      this.targetProgress = idx + 1;
    }
  }

  public jumpToIndex(index: number) {
    ambientSynth.playNodeWarp();
    this.targetProgress = Math.max(0, Math.min(this.totalNodes, index));
  }

  public refreshCardTextures() {
    this.cards.forEach((card) => {
      const oldMat = card.screenMesh.material as THREE.MeshStandardMaterial;
      if (oldMat.map) {
        oldMat.map.dispose();
      }
      const newTex = createProjectCardTexture(card.project);
      oldMat.map = newTex;
      oldMat.needsUpdate = true;
    });

    const oldLogoMat = this.logoMesh.material as THREE.MeshBasicMaterial;
    if (oldLogoMat.map) {
      oldLogoMat.map.dispose();
    }
    oldLogoMat.map = createLogoTexture();
    oldLogoMat.needsUpdate = true;
  }

  public setAutopilot(enabled: boolean) {
    this.isAutopilot = enabled;
  }

  public getAutopilot(): boolean {
    return this.isAutopilot;
  }

  public setWireframe(enabled: boolean) {
    this.isWireframe = enabled;
    this.cards.forEach((c) => {
      (c.screenMesh.material as THREE.MeshStandardMaterial).wireframe = enabled;
    });
    if (this.orbCore) (this.orbCore.material as THREE.MeshStandardMaterial).wireframe = enabled;
    if (this.orbShell1) (this.orbShell1.material as THREE.MeshStandardMaterial).wireframe = enabled;
    if (this.orbShell2) (this.orbShell2.material as THREE.MeshStandardMaterial).wireframe = enabled;
  }

  public getWireframe(): boolean {
    return this.isWireframe;
  }

  public setTheme(theme: 'bronze' | 'cyan' | 'monochrome') {
    this.currentTheme = theme;
    if (theme === 'cyan') {
      this.scene.fog = new THREE.FogExp2(0x050f12, 0.024);
      this.ambientLight.color.setHex(0x0d1f22);
      this.coreLight.color.setHex(0x00f0ff);
      this.cameraLight.color.setHex(0x80ffff);
      (this.gridHelper.material as THREE.LineBasicMaterial).color.setHex(0x00f0ff);
    } else if (theme === 'monochrome') {
      this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.024);
      this.ambientLight.color.setHex(0x1a1a1a);
      this.coreLight.color.setHex(0xffffff);
      this.cameraLight.color.setHex(0xcccccc);
      (this.gridHelper.material as THREE.LineBasicMaterial).color.setHex(0x888888);
    } else {
      this.scene.fog = new THREE.FogExp2(0x0b0806, 0.022);
      this.ambientLight.color.setHex(0x2d1e15);
      this.coreLight.color.setHex(0xd4af37);
      this.cameraLight.color.setHex(0xf3deb9);
      (this.gridHelper.material as THREE.LineBasicMaterial).color.setHex(0xc59b63);
    }
  }

  public getTheme(): string {
    return this.currentTheme;
  }

  private onResize = () => {
    if (this.isDestroyed || !this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.isMobile = w < 768;
    this.camera.fov = this.isMobile ? (w < h ? 58 : 50) : 45;
    this.camera.aspect = w / Math.max(h, 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private onPointerMove = (e: MouseEvent) => {
    // Parallax values -1 to +1
    this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // Raycast coordinate
    this.mouseVec.x = this.targetMouse.x;
    this.mouseVec.y = this.targetMouse.y;
  };

  private onClick = () => {
    if (this.hoveredCard) {
      ambientSynth.playCardClick();
      ambientSynth.playInspectChime();
      this.callbacks.onCardSelect(this.hoveredCard.project);
    }
  };

  /**
   * Core Render Loop: smooth lerp physics, card flight choreography, raycasting
   */
  private animate = (time: number) => {
    if (this.isDestroyed) return;
    this.animationFrameId = requestAnimationFrame(this.animate);

    const seconds = time * 0.001;

    // Autopilot flight progression
    if (this.isAutopilot) {
      this.targetProgress += 0.0022;
      if (this.targetProgress > this.totalNodes) {
        this.targetProgress = 0;
      }
    }

    // 1. Smooth Scroll Progress Lerp (Heavy cinematic inertia)
    const lerpSpeed = 0.044;
    this.currentProgress += (this.targetProgress - this.currentProgress) * lerpSpeed;

    // Report progress
    this.callbacks.onProgressUpdate(this.currentProgress);

    // 2. Smooth Mouse Parallax Lerp
    this.currentMouse.x += (this.targetMouse.x - this.currentMouse.x) * 0.05;
    this.currentMouse.y += (this.targetMouse.y - this.currentMouse.y) * 0.05;

    // 3. Camera Position and Track
    // Camera moves through the 3D space with subtle breathing and parallax
    const camBaseZ = 18;
    const camParallaxX = this.currentMouse.x * 1.2;
    const camParallaxY = this.currentMouse.y * 0.9;

    // As progress advances, the camera tilts dynamically and adjusts Z slightly
    this.camera.position.x = camParallaxX;
    this.camera.position.y = camParallaxY + Math.sin(seconds * 0.5) * 0.15;
    this.camera.position.z = camBaseZ + Math.sin(this.currentProgress * Math.PI) * 0.4;
    this.camera.lookAt(0, 0, 0);

    this.cameraLight.position.copy(this.camera.position);

    // 4. Central Orb Animation & Transformation
    // Orb rotates continuously with subtle pulse
    this.orbCore.rotation.y = seconds * 0.35;
    this.orbCore.rotation.x = seconds * 0.2;
    this.orbShell1.rotation.y = -seconds * 0.45;
    this.orbShell1.rotation.z = seconds * 0.25;
    this.orbShell2.rotation.x = seconds * 0.3;
    this.orbShell2.rotation.y = seconds * 0.3;

    this.orbRings.forEach((ring, idx) => {
      ring.rotation.z = seconds * (0.4 + idx * 0.15) * (idx % 2 === 0 ? 1 : -1);
    });

    this.orbFragments.forEach((frag, idx) => {
      frag.rotation.x += 0.015;
      frag.rotation.y += 0.02;
    });

    // When at Intro (progress near 0), the Orb and Logo are centered.
    // As progress increases, the Orb gently floats into the background as an ambient power core!
    const introFactor = Math.max(0, 1 - this.currentProgress);
    this.logoMesh.position.z = 4 + (1 - introFactor) * 25;
    (this.logoMesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, introFactor * 1.5 - 0.2);

    // Move orb deeper into background as journey unfolds
    const orbZ = - (this.currentProgress * 2.5);
    this.orbGroup.position.z = orbZ;
    this.orbGroup.position.y = Math.sin(seconds * 0.8) * 0.3;
    this.coreLight.position.copy(this.orbGroup.position);

    // 5. Environment Grid animation
    this.gridHelper.position.z = (seconds * 2.5) % 8;

    // 6. Particle Field drift with velocity response
    const scrollVelocity = Math.abs(this.targetProgress - this.currentProgress) * 1.8;
    const posAttr = this.particleSystem.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < posAttr.count; i++) {
      let pz = posAttr.getZ(i);
      pz += 0.08 + scrollVelocity;
      if (pz > 32) pz = -150;
      posAttr.setZ(i, pz);
    }
    posAttr.needsUpdate = true;

    // 7. REAL 3D FLOATING SCREENS CHOREOGRAPHY
    // Noticeably slowed down, heavy cinematic timing with authentic 3D spatial depth:
    // - Clear sequence where trailing card visibly follows behind the previous card along the 3D corridor.
    // - Large physical Z-depth separation (Z = 6.5 vs Z = -26 to -30, over 32 units of depth) prevents collision.
    // - Independent approach and departure lanes: departing card sweeps wide to its lateral flank and passes
    //   behind camera, while approaching card enters from the opposite flank into center.
    // - Full 360° axial roll on arrival and departure.
    // - Floating breathing and interactive mouse parallax at focal stabilization.
    let activeCardIndex = -1;
    let closestDist = Infinity;

    this.cards.forEach((card) => {
      const delta = this.currentProgress - card.index;

      // Dynamically compute responsive focal & mid-flight positions & scale based on aspect ratio
      const isPortrait = this.camera.aspect < 0.95;
      const baseFocalX = this.isMobile ? 0 : card.focalPosition.x;
      const baseFocalY = this.isMobile ? (isPortrait ? 0.35 : 0) : card.focalPosition.y;
      const baseFocalZ = this.isMobile ? (isPortrait ? 3.0 : 4.8) : card.focalPosition.z;
      const focalTarget = new THREE.Vector3(baseFocalX, baseFocalY, baseFocalZ);

      const baseMidX = this.isMobile ? (isPortrait ? 0 : card.midOffset.x * 0.5) : card.midOffset.x;
      const baseMidY = this.isMobile ? (isPortrait ? 0.35 : 0) : card.midOffset.y;
      const baseMidZ = card.midOffset.z;
      const midTarget = new THREE.Vector3(baseMidX, baseMidY, baseMidZ);

      // Adaptive scale so card is 100% visible on all mobile portrait screens without horizontal clipping
      const targetScale = this.isMobile
        ? Math.max(0.48, Math.min(0.72, this.camera.aspect * 1.25))
        : 1.0;

      // Outside active window: hidden & safely parked in background fog or far behind camera
      if (delta < -2.2) {
        card.mesh.visible = false;
        card.mesh.position.copy(card.entryOffset);
        card.mesh.rotation.copy(card.entryRotation);
        card.mesh.scale.set(0.18, 0.18, 0.18);
        card.currentOpacity = 0;
        (card.screenMesh.material as THREE.MeshStandardMaterial).opacity = 0;
        (card.screenMesh.material as THREE.MeshStandardMaterial).transparent = true;
        (card.frameMesh.material as THREE.LineBasicMaterial).opacity = 0;
        return;
      }

      if (delta > 1.5) {
        card.mesh.visible = false;
        card.mesh.position.copy(card.exitOffset);
        card.mesh.rotation.copy(card.exitRotation);
        card.mesh.scale.set(targetScale * 1.35, targetScale * 1.35, targetScale * 1.35);
        card.currentOpacity = 0;
        (card.screenMesh.material as THREE.MeshStandardMaterial).opacity = 0;
        (card.screenMesh.material as THREE.MeshStandardMaterial).transparent = true;
        (card.frameMesh.material as THREE.LineBasicMaterial).opacity = 0;
        return;
      }

      card.mesh.visible = true;

      const pos = new THREE.Vector3();
      const rot = new THREE.Euler();
      let scale = targetScale;
      let opacity = 1.0;

      if (delta < -1.0) {
        // PHASE 1: Deep approach from distant background fog towards the trailing mid-flight position
        // delta in [-2.2, -1.0]: 1.2 progress units of slow, majestic emergence
        const t = (delta - (-2.2)) / (-1.0 - (-2.2)); // 0 to 1
        const clampedT = Math.min(1, Math.max(0, t));
        const ease = 1 - Math.pow(1 - clampedT, 2.0);

        pos.lerpVectors(card.entryOffset, midTarget, ease);
        rot.x = THREE.MathUtils.lerp(card.entryRotation.x, card.midRotation.x, ease);
        rot.y = THREE.MathUtils.lerp(card.entryRotation.y, card.midRotation.y, ease);
        rot.z = THREE.MathUtils.lerp(card.entryRotation.z, card.midRotation.z, ease);

        scale = THREE.MathUtils.lerp(0.22 * targetScale, 0.44 * targetScale, ease);
        opacity = THREE.MathUtils.lerp(0.0, 0.65, ease);
      } else if (delta < 0.0) {
        // PHASE 2: Mid-flight trailing approach into the central focal spotlight
        // delta in [-1.0, 0.0]: trailing distinctly in the 3D scene behind the previous card, then gliding to center
        const t = delta + 1.0; // 0 to 1
        const clampedT = Math.min(1, Math.max(0, t));
        const ease = 1 - Math.pow(1 - clampedT, 2.2);

        pos.lerpVectors(midTarget, focalTarget, ease);
        rot.x = THREE.MathUtils.lerp(card.midRotation.x, card.focalRotation.x, ease);
        rot.y = THREE.MathUtils.lerp(card.midRotation.y, card.focalRotation.y, ease);
        rot.z = THREE.MathUtils.lerp(card.midRotation.z, card.focalRotation.z, ease);

        scale = THREE.MathUtils.lerp(0.44 * targetScale, targetScale, ease);
        opacity = THREE.MathUtils.lerp(0.65, 1.0, ease);
      } else if (delta <= 0.35) {
        // PHASE 3: Focal stabilization & showcase right in front of camera
        // Card is stationary at focalTarget with subtle breathing float and mouse parallax
        pos.copy(focalTarget);
        pos.x += this.currentMouse.x * (this.isMobile ? 0.2 : 0.38);
        pos.y += this.currentMouse.y * (this.isMobile ? 0.15 : 0.28);
        pos.z += Math.sin(seconds * 1.2) * 0.08;

        rot.x = card.focalRotation.x - this.currentMouse.y * 0.12;
        rot.y = card.focalRotation.y + this.currentMouse.x * 0.18;
        rot.z = card.focalRotation.z;

        // Interactive 3D micro-tilt when hovered
        if (card === this.hoveredCard) {
          rot.x += -this.currentMouse.y * 0.08;
          rot.y += this.currentMouse.x * 0.12;
          pos.z += 0.2;
        }

        scale = targetScale;
        opacity = 1.0;
      } else {
        // PHASE 4: Departure peel-off and pass-around camera
        // delta in [0.35, 1.5]: sweeps wide laterally to flank and passes behind camera with 360° departure spin
        const t = (delta - 0.35) / (1.5 - 0.35); // 0 to 1
        const clampedT = Math.min(1, Math.max(0, t));
        const ease = Math.pow(clampedT, 1.9);

        pos.lerpVectors(focalTarget, card.exitOffset, ease);
        rot.x = THREE.MathUtils.lerp(card.focalRotation.x, card.exitRotation.x, ease);
        rot.y = THREE.MathUtils.lerp(card.focalRotation.y, card.exitRotation.y, ease);
        rot.z = THREE.MathUtils.lerp(card.focalRotation.z, card.exitRotation.z, ease);

        scale = THREE.MathUtils.lerp(targetScale, targetScale * 1.35, ease);
        opacity = Math.max(0, 1.0 - Math.pow(clampedT, 1.6) * 1.15);
      }

      card.mesh.position.copy(pos);
      card.mesh.rotation.copy(rot);
      card.mesh.scale.set(scale, scale, scale);

      card.currentOpacity = opacity;
      (card.screenMesh.material as THREE.MeshStandardMaterial).opacity = opacity;
      (card.screenMesh.material as THREE.MeshStandardMaterial).transparent = opacity < 0.99;
      (card.frameMesh.material as THREE.LineBasicMaterial).opacity = opacity * 0.75;

      // Determine the card closest to the focal center
      const dist = Math.abs(delta - 0.12);
      if (dist < closestDist) {
        closestDist = dist;
        activeCardIndex = card.index;
      }
    });

    // Notify active section if changed
    if (activeCardIndex !== -1 && activeCardIndex !== this.lastActiveIndex && closestDist < 0.45) {
      this.lastActiveIndex = activeCardIndex;
      const activeProject = PORTFOLIO_DATA[activeCardIndex - 1] || null;
      ambientSynth.playNodeWarp();
      this.callbacks.onActiveSectionChange(activeCardIndex, activeProject);
    } else if (this.currentProgress < 0.4 && this.lastActiveIndex !== 0) {
      this.lastActiveIndex = 0;
      this.callbacks.onActiveSectionChange(0, null);
    }

    // 8. Raycasting for interactive hover states (only front card in focal zone is interactive)
    this.raycaster.setFromCamera(this.mouseVec, this.camera);
    const interactiveMeshes = this.cards
      .filter((c) => c.mesh.visible && c.currentOpacity > 0.8 && Math.abs(this.currentProgress - c.index) < 0.45)
      .map((c) => c.screenMesh);
    const intersects = this.raycaster.intersectObjects(interactiveMeshes);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const card = this.cards.find((c) => c.screenMesh === hitMesh);
      if (card && card !== this.hoveredCard) {
        if (this.hoveredCard) {
          (this.hoveredCard.frameMesh.material as THREE.LineBasicMaterial).color.setHex(0xc59b63);
        }
        this.hoveredCard = card;
        ambientSynth.playHoverTick();
        (card.frameMesh.material as THREE.LineBasicMaterial).color.setHex(0xfff0d4);
        document.body.style.cursor = 'pointer';
      }
    } else {
      if (this.hoveredCard) {
        (this.hoveredCard.frameMesh.material as THREE.LineBasicMaterial).color.setHex(0xc59b63);
        this.hoveredCard = null;
        document.body.style.cursor = 'default';
      }
    }

    // 9. Render Scene
    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Cleanup resources on unmount
   */
  public destroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.animationFrameId);

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('click', this.onClick);
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('wheel', this.onWheel);

    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
