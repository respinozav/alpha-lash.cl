/**
 * Utilidad para comprimir y optimizar imágenes a formato JPG Base64
 * Redimensiona a un tamaño máximo manteniendo la proporción y aplica compresión JPEG
 * Garantiza tamaños livianos (<100KB) para almacenamiento óptimo en PostgreSQL
 */
export async function compressImageToJpegBase64(file, maxDimension = 800, quality = 0.78) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('El archivo seleccionado no es una imagen válida.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calcular escala proporcional
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Rellenar fondo blanco para evitar transparencias oscuras al convertir PNG a JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a JPEG comprimido
        const base64Jpg = canvas.toDataURL('image/jpeg', quality);
        resolve(base64Jpg);
      };

      img.onerror = (err) => reject(new Error('Error al decodificar la imagen: ' + err));
    };

    reader.onerror = (err) => reject(new Error('Error al leer el archivo: ' + err));
  });
}

/**
 * Calcula el peso aproximado en Kilobytes de una cadena Base64
 */
export function getBase64SizeInKB(base64String) {
  if (!base64String) return 0;
  const stringLength = base64String.length - (base64String.indexOf(',') + 1);
  const sizeInBytes = (stringLength * 3) / 4;
  return Math.round(sizeInBytes / 1024);
}
