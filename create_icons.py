#!/usr/bin/env python3
"""Create placeholder icon files for Tauri app."""

from PIL import Image, ImageDraw
import os

# Create icons directory
icons_dir = r"D:\project\learning-companion\src-tauri\icons"
os.makedirs(icons_dir, exist_ok=True)

# Create a simple 32x32 icon (green square with "L" for Learning)
sizes = [32, 128, 256]
for size in sizes:
    img = Image.new('RGBA', (size, size), (76, 175, 80, 255))  # Green background
    draw = ImageDraw.Draw(img)

    # Draw a simple "L" or cat face
    if size >= 64:
        # Draw simple cat ears
        margin = size // 8
        ear_size = size // 4
        # Left ear
        draw.polygon([
            (margin, size // 2),
            (margin + ear_size // 2, margin),
            (margin + ear_size, size // 2)
        ], fill=(76, 175, 80, 255))
        # Right ear
        draw.polygon([
            (size - margin - ear_size, size // 2),
            (size - margin - ear_size // 2, margin),
            (size - margin, size // 2)
        ], fill=(76, 175, 80, 255))

    # Save as PNG
    img.save(os.path.join(icons_dir, f'{size}x{size}.png'))
    print(f"Created {size}x{size}.png")

# Create 128x128@2x (256x256)
if os.path.exists(os.path.join(icons_dir, '256x256.png')):
    import shutil
    shutil.copy(
        os.path.join(icons_dir, '256x256.png'),
        os.path.join(icons_dir, '128x128@2x.png')
    )
    print("Created 128x128@2x.png")

# Create ICO file (Windows requires this)
img_32 = Image.open(os.path.join(icons_dir, '32x32.png'))
img_32.save(os.path.join(icons_dir, 'icon.ico'))
print("Created icon.ico")

# Create ICNS for macOS (optional)
# For now, we'll skip ICNS as it requires special format
print("\nAll icons created successfully!")
print(f"Icons saved to: {icons_dir}")
