import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'export',        // Включаем статический экспорт
  distDir: '../build',     // Путь для билда (на уровень выше)
  images: {
    unoptimized: true,     // Для статического экспорта
  },
}

export default config
