import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import crypto from 'crypto'
import path from 'path';

const generateScopedName = (name, filename, css) => {
  const normalizedFilename = path.basename(filename, '.module.css')
  const hashInput = `${normalizedFilename}-${name}`
  const hash = crypto.createHash('md5')
    .update(hashInput)
    .digest('base64')
    .replace(/\+/g, '-')  // Replace + with -
    .replace(/\//g, '_')  // Replace / with _
    .replace(/=/g, '')    // Remove = padding
    .substring(0, 5)
  return `${normalizedFilename}__${name}___${hash}`
}

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'react-css-modules',
            {
              generateScopedName,
              webpackHotModuleReloading: false,
              autoResolveMultipleImports: true,
              handleMissingStyleName: 'warn',
              exclude: 'node_modules',
              filetypes: {
                '.css': {
                  syntax: 'postcss'
                }
              }
            }
          ]
        ]
      }
    })
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName
    }
  }
})