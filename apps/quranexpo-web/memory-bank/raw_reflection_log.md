---
Date: 2025_05_27
TaskRef: "Migración de base de datos de Neon a Turso e integración con quran-data-api"

Learnings:
- Se confirmó que el error "Datasource provider not known: "libsql"" de Prisma se resuelve configurando `provider = "sqlite"` en `schema.prisma` y utilizando `@prisma/adapter-libsql` para la conexión en tiempo de ejecución.
- La instanciación de `PrismaLibSQL` requiere un objeto de configuración `{ url: LIBSQL_URL, authToken: LIBSQL_AUTH_TOKEN }` directamente, no una instancia de cliente de `@libsql/client`.
- Mover `prisma` y `@prisma/client` de `devDependencies` a `dependencies` en `package.json` es una solución recomendada para problemas de despliegue en entornos como Vercel, especialmente en monorepos.
- La importancia de leer el archivo más reciente antes de aplicar `diffs` para evitar errores de coincidencia.
- **Nuevo aprendizaje:** El orden de ejecución de `tsc` y `prisma generate` en el script de build de Vercel es crucial. `prisma generate` debe ejecutarse *antes* de `tsc` para asegurar que los tipos generados estén disponibles para la compilación de TypeScript.

Difficulties:
- Error de modo al intentar editar `package.json` en modo `architect`. Se corrigió cambiando a modo `code`.
- El `apply_diff` inicial falló debido a que el contenido del `package.json` había cambiado, requiriendo una relectura del archivo.
- El `apply_diff` para `consolidated_learnings.md` falló debido a un formato de diff incorrecto (doble `=======`).

Successes:
- Se logró resolver el error de Prisma "Datasource provider not known: "libsql"" localmente.
- Se actualizó correctamente el `package.json` moviendo las dependencias de Prisma.
- `pnpm install` se ejecutó con éxito después de la modificación del `package.json`.
- Se corrigió el orden de ejecución de `tsc` y `prisma generate` en el script `build:functions`.

Improvements_Identified_For_Consolidation:
- Patrón general: Configuración de Prisma con `libsql` (usar `sqlite` como `provider` y adaptador en código).
- Despliegue en Vercel: Dependencias de Prisma en `dependencies` para monorepos.
- Proceso de trabajo: Siempre verificar el contenido del archivo antes de `apply_diff`.
- **Nuevo patrón:** Orden de ejecución de `prisma generate` y `tsc` en scripts de build.
---
