---
Date: 2025_05_27
TaskRef: "Migración de base de datos de Neon a Turso e integración con quran-data-api"

Learnings:
- Se confirmó que el error "Datasource provider not known: "libsql"" de Prisma se resuelve configurando `provider = "sqlite"` en `schema.prisma` y utilizando `@prisma/adapter-libsql` para la conexión en tiempo de ejecución.
- La instanciación de `PrismaLibSQL` requiere un objeto de configuración `{ url: LIBSQL_URL, authToken: LIBSQL_AUTH_TOKEN }` directamente, no una instancia de cliente de `@libsql/client`.
- Mover `prisma` y `@prisma/client` de `devDependencies` a `dependencies` en `package.json` es una solución recomendada para problemas de despliegue en entornos como Vercel, especialmente en monorepos.
- La importancia de leer el archivo más reciente antes de aplicar `diffs` para evitar errores de coincidencia.
- El orden de ejecución de `tsc` y `prisma generate` en el script de build de Vercel es crucial. `prisma generate` debe ejecutarse *antes* de `tsc` para asegurar que los tipos generados estén disponibles para la compilación de TypeScript.
- **Nuevo aprendizaje:** Re-habilitar el script `postinstall` en `package.json` para ejecutar `prisma generate` es fundamental para asegurar que el cliente de Prisma se genere después de la instalación de dependencias en entornos de despliegue como Vercel.
- **Nuevo aprendizaje:** Añadir `paths` explícitos en `tsconfig.json` para los tipos generados por Prisma (ej. `"../generated/prisma": ["./generated/prisma"]`) es una capa adicional para asegurar que TypeScript encuentre los tipos correctamente en monorepos y entornos de despliegue.

Difficulties:
- Error de modo al intentar editar `package.json` en modo `architect`. Se corrigió cambiando a modo `code`.
- El `apply_diff` inicial falló debido a que el contenido del `package.json` había cambiado, requiriendo una relectura del archivo.
- El `apply_diff` para `consolidated_learnings.md` falló debido a un formato de diff incorrecto (doble `=======`).
- El error `Property 'startIndex' is missing` persistió en Vercel a pesar de las correcciones iniciales, lo que llevó a una investigación más profunda sobre la interacción de Prisma, Turso y Vercel en monorepos.

Successes:
- Se logró resolver el error de Prisma "Datasource provider not known: "libsql"" localmente.
- Se actualizó correctamente el `package.json` moviendo las dependencias de Prisma.
- `pnpm install` se ejecutó con éxito después de la modificación del `package.json`.
- Se corrigió el orden de ejecución de `tsc` y `prisma generate` en el script `build:functions`.
- Se re-habilitó el script `postinstall` para `prisma generate`.
- Se añadió la configuración de `paths` en `tsconfig.json`.

Improvements_Identified_For_Consolidation:
- Patrón general: Configuración de Prisma con `libsql` (usar `sqlite` como `provider` y adaptador en código).
- Despliegue en Vercel: Dependencias de Prisma en `dependencies` para monorepos.
- Proceso de trabajo: Siempre verificar el contenido del archivo antes de `apply_diff`.
- Orden de ejecución de `prisma generate` y `tsc` en scripts de build.
- **Nuevo patrón:** Uso de `postinstall` para `prisma generate` en Vercel.
- **Nuevo patrón:** Configuración de `paths` en `tsconfig.json` para tipos de Prisma en monorepos.
---
