import * as THREE from 'three';
import { ProjectItem } from '../data/portfolioData';

/**
 * Creates high-resolution, ultra-crisp HTML5 Canvas textures for 3D floating screens.
 * Styled with obsidian carbon, espresso tones, metallic bronze trims, and custom telemetry graphics.
 */
export function createProjectCardTexture(project: ProjectItem): THREE.CanvasTexture {
  const width = 1600;
  const height = 1000;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Background: Deep rich espresso / obsidian carbon gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#150f0a');
  bgGrad.addColorStop(0.5, '#0b0806');
  bgGrad.addColorStop(1, '#18110b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle architectural micro-grid
  ctx.strokeStyle = 'rgba(197, 155, 99, 0.04)';
  ctx.lineWidth = 1;
  const gridSize = 50;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 3. Ambient warm bronze corner glow
  const glowGrad = ctx.createRadialGradient(width * 0.88, height * 0.18, 10, width * 0.88, height * 0.18, 550);
  glowGrad.addColorStop(0, 'rgba(197, 155, 99, 0.18)');
  glowGrad.addColorStop(0.7, 'rgba(140, 98, 57, 0.05)');
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  // 4. Outer metallic bronze border with corner tech notches
  ctx.strokeStyle = '#6e492b';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  ctx.strokeStyle = '#c59b63';
  ctx.lineWidth = 4;
  const notch = 75;
  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(28, notch); ctx.lineTo(28, 28); ctx.lineTo(notch, 28);
  ctx.stroke();
  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(width - notch, 28); ctx.lineTo(width - 28, 28); ctx.lineTo(width - 28, notch);
  ctx.stroke();
  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(28, height - notch); ctx.lineTo(28, height - 28); ctx.lineTo(notch, height - 28);
  ctx.stroke();
  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(width - notch, height - 28); ctx.lineTo(width - 28, height - 28); ctx.lineTo(width - 28, height - notch);
  ctx.stroke();

  // Corner metallic hex rivets
  const rivetCoords = [
    [54, 54],
    [width - 54, 54],
    [54, height - 54],
    [width - 54, height - 54],
  ];
  rivetCoords.forEach(([rx, ry]) => {
    ctx.fillStyle = '#2a1d15';
    ctx.beginPath();
    ctx.arc(rx, ry, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c59b63';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // 5. Watermark Monogram in background
  ctx.font = '900 180px Cinzel, serif';
  ctx.fillStyle = 'rgba(197, 155, 99, 0.035)';
  ctx.textAlign = 'right';
  ctx.fillText('AEVRNN', width - 60, height - 130);

  // 6. Header: Section number & category + Live LED Indicator
  ctx.textAlign = 'left';
  ctx.font = '700 24px "Space Mono", monospace';
  ctx.fillStyle = '#c59b63';
  ctx.fillText(`${project.sectionNumber} // ${project.sectionTitle}`, 72, 90);

  // Category specific accent color for status indicator
  let ledColor = '#22c55e'; // default green
  let statusText = 'SYSTEM // OPERATIONAL';
  if (project.category === 'discord') {
    ledColor = '#38bdf8';
    statusText = 'BOT ARCHITECTURE // VERIFIED';
  } else if (project.category === 'editing') {
    ledColor = '#f59e0b';
    statusText = '60FPS // PRORES MASTER';
  } else if (project.category === 'web') {
    ledColor = '#a855f7';
    statusText = 'REACT 19 • THREE.JS // RUNTIME';
  }

  // Live Pulse Dot
  ctx.fillStyle = ledColor;
  ctx.beginPath();
  ctx.arc(width - 320, 82, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '600 16px "Space Mono", monospace';
  ctx.fillStyle = ledColor;
  ctx.fillText(statusText, width - 305, 88);

  // Top-right tag pill
  const tagText = project.tag;
  ctx.font = '700 18px "Space Mono", monospace';
  const tagMetrics = ctx.measureText(tagText);
  const tagWidth = tagMetrics.width + 36;
  const tagHeight = 36;
  const tagX = width - 72 - tagWidth;
  const tagY = 120;

  ctx.fillStyle = 'rgba(197, 155, 99, 0.14)';
  ctx.fillRect(tagX, tagY, tagWidth, tagHeight);
  ctx.strokeStyle = '#c59b63';
  ctx.lineWidth = 2;
  ctx.strokeRect(tagX, tagY, tagWidth, tagHeight);

  ctx.fillStyle = '#f0ddc2';
  ctx.fillText(tagText, tagX + 18, tagY + 25);

  // Divider line below header
  ctx.strokeStyle = 'rgba(197, 155, 99, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(72, 120);
  ctx.lineTo(tagX - 24, 120);
  ctx.stroke();

  // 7. Subtitle
  ctx.font = '700 22px "Space Mono", monospace';
  ctx.fillStyle = '#b38f65';
  ctx.fillText(project.subtitle.toUpperCase(), 72, 180);

  // 8. Main Title (Cinzel display serif)
  ctx.font = '900 68px Cinzel, serif';
  const titleGrad = ctx.createLinearGradient(72, 190, 72, 270);
  titleGrad.addColorStop(0, '#ffffff');
  titleGrad.addColorStop(0.5, '#f5ede6');
  titleGrad.addColorStop(1, '#c59b63');
  ctx.fillStyle = titleGrad;
  ctx.fillText(project.title, 72, 265);

  // 9. Description text (multi-line word wrap)
  ctx.font = '400 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#dfd6ce';
  const descWords = project.description.split(' ');
  let line = '';
  let yPos = 345;
  const maxLineWidth = width * 0.58; // Leave right side for graphic visualizer!
  const lineHeight = 44;

  for (let n = 0; n < descWords.length; n++) {
    const testLine = line + descWords[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxLineWidth && n > 0) {
      ctx.fillText(line, 72, yPos);
      line = descWords[n] + ' ';
      yPos += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 72, yPos);

  // Detailed snippet preview below description
  if (project.detailedText) {
    yPos += 20;
    ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#a8998d';
    const detailSnippet = project.detailedText.split('.')[0] + '.';
    ctx.fillText(detailSnippet, 72, yPos + 30);
    yPos += 45;
  }

  // 10. Tags Pill Row
  yPos = Math.max(yPos + 40, 580);
  let pillX = 72;
  ctx.font = '600 18px "Space Mono", monospace';

  for (const tag of project.tags.slice(0, 4)) {
    const textWidth = ctx.measureText(tag).width;
    const pWidth = textWidth + 30;
    const pHeight = 40;

    ctx.fillStyle = '#1e140d';
    ctx.fillRect(pillX, yPos, pWidth, pHeight);
    ctx.strokeStyle = 'rgba(197, 155, 99, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pillX, yPos, pWidth, pHeight);

    ctx.fillStyle = '#c59b63';
    ctx.fillText(tag, pillX + 15, yPos + 26);

    pillX += pWidth + 14;
  }

  // 11. CATEGORY DEDICATED GRAPHIC TELEMETRY PANEL (Right Side)
  const panelX = width * 0.63;
  const panelY = 220;
  const panelW = width * 0.32;
  const panelH = 500;

  // Panel Container
  ctx.fillStyle = 'rgba(20, 14, 10, 0.85)';
  ctx.fillRect(panelX, panelY, panelW, panelH);
  ctx.strokeStyle = 'rgba(197, 155, 99, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(panelX, panelY, panelW, panelH);

  // Panel Header Bar
  ctx.fillStyle = 'rgba(197, 155, 99, 0.12)';
  ctx.fillRect(panelX, panelY, panelW, 42);
  ctx.fillStyle = '#e6c594';
  ctx.font = '700 15px "Space Mono", monospace';
  ctx.fillText('DIAGNOSTICS & TELEMETRY', panelX + 18, panelY + 27);

  // Render Custom Content in panel based on Category
  if (project.category === 'minecraft') {
    // Minecraft Server Telemetry
    ctx.font = '600 17px "Space Mono", monospace';
    ctx.fillStyle = '#22c55e';
    ctx.fillText('● ENGINE: PAPER / SPIGOT 1.20', panelX + 22, panelY + 85);
    ctx.fillText('● TPS: 20.0 / 20.0 (100%)', panelX + 22, panelY + 125);
    ctx.fillText('● PING: 18ms (LOW LATENCY)', panelX + 22, panelY + 165);

    // Simulated Voxel Isometric Diagram
    ctx.strokeStyle = '#c59b63';
    ctx.lineWidth = 2;
    const cx = panelX + panelW / 2;
    const cy = panelY + 280;
    const size = 50;

    // Draw 3D wireframe cube
    // Top face
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx + size * 1.2, cy - size * 0.4);
    ctx.lineTo(cx, cy + size * 0.2);
    ctx.lineTo(cx - size * 1.2, cy - size * 0.4);
    ctx.closePath();
    ctx.fillStyle = 'rgba(197, 155, 99, 0.15)';
    ctx.fill();
    ctx.stroke();

    // Left face
    ctx.beginPath();
    ctx.moveTo(cx - size * 1.2, cy - size * 0.4);
    ctx.lineTo(cx, cy + size * 0.2);
    ctx.lineTo(cx, cy + size * 1.2);
    ctx.lineTo(cx - size * 1.2, cy + size * 0.6);
    ctx.closePath();
    ctx.fillStyle = 'rgba(140, 98, 57, 0.25)';
    ctx.fill();
    ctx.stroke();

    // Right face
    ctx.beginPath();
    ctx.moveTo(cx, cy + size * 0.2);
    ctx.lineTo(cx + size * 1.2, cy - size * 0.4);
    ctx.lineTo(cx + size * 1.2, cy + size * 0.6);
    ctx.lineTo(cx, cy + size * 1.2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(197, 155, 99, 0.35)';
    ctx.fill();
    ctx.stroke();

    // Server IP badge
    ctx.fillStyle = '#17100b';
    ctx.fillRect(panelX + 20, panelY + panelH - 85, panelW - 40, 48);
    ctx.strokeStyle = '#c59b63';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(panelX + 20, panelY + panelH - 85, panelW - 40, 48);

    ctx.fillStyle = '#f5ede6';
    ctx.font = '700 16px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('IP: zentramc.loca.lol', panelX + panelW / 2, panelY + panelH - 55);
    ctx.textAlign = 'left';
  } else if (project.category === 'discord') {
    // Discord Bot Terminal
    ctx.font = '500 15px "Space Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('$ discord.js --cluster --shards=all', panelX + 20, panelY + 80);

    ctx.fillStyle = '#a8998d';
    ctx.fillText('[LOG] Gateway: READY', panelX + 20, panelY + 120);
    ctx.fillText('[LOG] Commands cached: 64', panelX + 20, panelY + 155);

    ctx.fillStyle = '#4ade80';
    ctx.fillText('[REST] Heartbeat ack (14ms)', panelX + 20, panelY + 190);

    ctx.fillStyle = '#e5c499';
    ctx.fillText('[EVENT] InteractionCreate', panelX + 20, panelY + 230);
    ctx.fillText('[AUTH] Guild verified OK', panelX + 20, panelY + 265);

    // Audio / Event bars
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.strokeRect(panelX + 20, panelY + 310, panelW - 40, 60);
    for (let i = 0; i < 28; i++) {
      const bh = Math.sin(i * 0.7) * 22 + 25;
      ctx.fillStyle = i % 4 === 0 ? '#38bdf8' : '#c59b63';
      ctx.fillRect(panelX + 30 + i * 15, panelY + 360 - bh, 8, bh);
    }

    ctx.fillStyle = '#f5ede6';
    ctx.font = '700 15px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SECURITY: ZERO PERMISSION LEAKS', panelX + panelW / 2, panelY + panelH - 45);
    ctx.textAlign = 'left';
  } else if (project.category === 'editing') {
    // Video Editing Timeline & Spectrum
    ctx.font = '600 16px "Space Mono", monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('TIMELINE // 00:01:24:18', panelX + 22, panelY + 80);
    ctx.fillStyle = '#dcd3cb';
    ctx.fillText('CODEC: PRORES 4444 XQ', panelX + 22, panelY + 115);
    ctx.fillText('FRAME RATE: 60.000 FPS', panelX + 22, panelY + 150);

    // Waveform spectrum
    ctx.fillStyle = '#1c130d';
    ctx.fillRect(panelX + 20, panelY + 180, panelW - 40, 140);
    ctx.strokeStyle = '#8c6239';
    ctx.strokeRect(panelX + 20, panelY + 180, panelW - 40, 140);

    for (let i = 0; i < 35; i++) {
      const h1 = Math.abs(Math.sin(i * 0.45)) * 50 + 10;
      ctx.fillStyle = '#c59b63';
      ctx.fillRect(panelX + 28 + i * 12, panelY + 250 - h1, 6, h1 * 2);
    }

    // Playhead red line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(panelX + panelW * 0.55, panelY + 180);
    ctx.lineTo(panelX + panelW * 0.55, panelY + 320);
    ctx.stroke();

    ctx.fillStyle = '#e6c594';
    ctx.font = '700 15px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('AFTER EFFECTS & PREMIERE PRO', panelX + panelW / 2, panelY + panelH - 50);
    ctx.textAlign = 'left';
  } else {
    // Code / Skills / Web / General
    ctx.font = '500 15px "Space Mono", monospace';
    ctx.fillStyle = '#a855f7';
    ctx.fillText('// HIGH-PERFORMANCE RUNTIME', panelX + 20, panelY + 80);
    ctx.fillStyle = '#60a5fa';
    ctx.fillText('import { Canvas } from "three";', panelX + 20, panelY + 115);
    ctx.fillStyle = '#34d399';
    ctx.fillText('const scene = new Scene();', panelX + 20, panelY + 150);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('scene.enableCinematicMode();', panelX + 20, panelY + 185);

    // Skill meters
    const skills = [
      { name: 'Paper Java / Config', pct: 96 },
      { name: 'Discord Architecture', pct: 94 },
      { name: 'Premiere & AE VFX', pct: 92 },
      { name: 'WebGL & React 19', pct: 88 },
    ];

    skills.forEach((s, idx) => {
      const sy = panelY + 240 + idx * 52;
      ctx.fillStyle = '#dcd3cb';
      ctx.font = '600 14px "Space Mono", monospace';
      ctx.fillText(s.name, panelX + 20, sy);
      ctx.fillText(`${s.pct}%`, panelX + panelW - 55, sy);

      ctx.fillStyle = '#241810';
      ctx.fillRect(panelX + 20, sy + 8, panelW - 40, 8);
      ctx.fillStyle = '#c59b63';
      ctx.fillRect(panelX + 20, sy + 8, (panelW - 40) * (s.pct / 100), 8);
    });

    ctx.fillStyle = '#f5ede6';
    ctx.font = '700 15px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BUILT FOR SPEED & ARTISTRY', panelX + panelW / 2, panelY + panelH - 45);
    ctx.textAlign = 'left';
  }

  // 12. Footer line & action bar
  ctx.strokeStyle = 'rgba(197, 155, 99, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(72, height - 100);
  ctx.lineTo(width - 72, height - 100);
  ctx.stroke();

  // Action CTA left
  ctx.font = '700 20px "Space Mono", monospace';
  ctx.fillStyle = '#c59b63';
  ctx.fillText('[ 3D INTERACTIVE NODE ]', 72, height - 52);

  // Action CTA right
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f0ddc2';
  ctx.fillText('CLICK / TAP SCREEN TO INSPECT ↗', width - 72, height - 52);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Creates high-res canvas texture for the AEVRNN 3D Logo Monogram
 */
export function createLogoTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);

  // Radial bronze aura
  const radial = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, 480);
  radial.addColorStop(0, 'rgba(197, 155, 99, 0.35)');
  radial.addColorStop(0.5, 'rgba(140, 98, 57, 0.12)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, size, size);

  // Concentric ring guides
  ctx.strokeStyle = 'rgba(197, 155, 99, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 420, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(197, 155, 99, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 380, 0, Math.PI * 2);
  ctx.stroke();

  // Tick marks
  for (let i = 0; i < 36; i++) {
    const angle = (i * Math.PI * 2) / 36;
    const r1 = 380;
    const r2 = i % 3 === 0 ? 405 : 392;
    ctx.beginPath();
    ctx.moveTo(size / 2 + Math.cos(angle) * r1, size / 2 + Math.sin(angle) * r1);
    ctx.lineTo(size / 2 + Math.cos(angle) * r2, size / 2 + Math.sin(angle) * r2);
    ctx.stroke();
  }

  // Central Emblem text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 130px Cinzel, serif';

  const textGrad = ctx.createLinearGradient(size / 2, size / 2 - 100, size / 2, size / 2 + 100);
  textGrad.addColorStop(0, '#ffffff');
  textGrad.addColorStop(0.4, '#f0ddc2');
  textGrad.addColorStop(1, '#c59b63');
  ctx.fillStyle = textGrad;
  ctx.fillText('AEVRNN', size / 2, size / 2 - 20);

  ctx.font = '700 24px "Space Mono", monospace';
  ctx.fillStyle = '#c59b63';
  ctx.fillText('BUILD  •  EDIT  •  CREATE', size / 2, size / 2 + 75);

  ctx.font = '600 16px "Space Mono", monospace';
  ctx.fillStyle = 'rgba(230, 197, 148, 0.75)';
  ctx.fillText('SYS // CINEMATIC 3D REEL', size / 2, size / 2 + 120);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Creates texture for the 3D floor / grid background datum markers
 */
export function createGridDatumTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0b0806';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = 'rgba(197, 155, 99, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(10, 10, size - 20, size - 20);

  ctx.fillStyle = 'rgba(197, 155, 99, 0.4)';
  ctx.font = '16px "Space Mono", monospace';
  ctx.fillText('AEVRNN // SYS.3D', 24, 40);
  ctx.fillText('SEC // OBSIDIAN', 24, size - 30);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}
