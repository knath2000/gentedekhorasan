# Revelación Crítica: `apps/quranexpo-web` es un Submódulo de Git

## Diagnóstico:
El error `fatal: Pathspec 'apps/quranexpo-web/build.sh' is in submodule 'apps/quranexpo-web'` al intentar `git add` el archivo `build.sh` indica que el directorio `apps/quranexpo-web` no es un directorio regular dentro del monorepo `quranexpo2`, sino que está configurado como un **submódulo de Git**.

## Impacto Inmediato:
Esta es una revelación fundamental y probablemente la **causa raíz de todos los problemas de build persistentes en Vercel** para `quranexpo-web`.

1.  **Archivos No Visibles/Rastreados por el Repo Principal:** El repositorio `quranexpo2` no rastrea directamente los archivos *dentro* de `apps/quranexpo-web`. Solo rastrea una referencia a un commit específico del repositorio del submódulo.
2.  **Clonación en Vercel:** Vercel clona el repositorio principal. Por defecto, puede que no inicialice/actualice completamente el contenido de los submódulos, o si lo hace, los trata como entidades separadas. Esto significa que archivos como `apps/quranexpo-web/build.sh` o `apps/quranexpo-web/package.json` podrían no estar disponibles para Vercel en el contexto del build del monorepo principal de la manera que esperan nuestras configuraciones en `vercel.json`.
3.  **Fallo de Comandos `git add`:** Los intentos de añadir `apps/quranexpo-web/build.sh` desde la raíz del monorepo fallaron porque Git reconoce que esa ruta pertenece a un submódulo. Los cambios dentro de un submódulo deben hacerse commit *dentro* del directorio del submódulo y luego la referencia del submódulo debe actualizarse en el repositorio principal.
4.  **Builds de ~7ms en Vercel:** Si Vercel no puede "ver" o acceder correctamente al contenido del submódulo `apps/quranexpo-web` (incluyendo su `package.json` o el `build.sh`), entonces no hay nada que construir para esa parte, lo que resulta en el build ultra rápido y el subsecuente 404.

## Opciones de Solución (Requieren Acción del Usuario):

### Opción 1: Integrar el Submódulo en el Monorepo Principal (Recomendado)
Convertir `apps/quranexpo-web` en un directorio regular dentro de `quranexpo2`.
   - **Pros:** Simplifica drásticamente la configuración de build y deploy con Vercel, pnpm workspaces y Turborepo. Crea una estructura de monorepo más cohesiva y predecible.
   - **Cons:** Se pierde el historial de Git separado de `quranexpo-web` (se fusiona con el historial de `quranexpo2`).
   - **Pasos Clave:**
        1.  Hacer backup de `apps/quranexpo-web`.
        2.  `git submodule deinit -f apps/quranexpo-web`
        3.  `git rm -f apps/quranexpo-web`
        4.  `rm -rf .git/modules/apps/quranexpo-web`
        5.  `git commit -m "Remove quranexpo-web submodule"`
        6.  Copiar el contenido del proyecto `quranexpo-web` en el directorio `apps/quranexpo-web`.
        7.  `git add apps/quranexpo-web`
        8.  `git commit -m "Integrate quranexpo-web directly into monorepo"`
        9.  `git push`

### Opción 2: Mantener como Submódulo y Configurar Apropiadamente
   - **Pros:** Mantiene el historial de Git separado y la modularidad si es un requisito estricto.
   - **Cons:** Mucho más complejo de configurar correctamente para Vercel y builds de monorepo. Mayor probabilidad de problemas.
   - **Pasos Clave:**
        1.  Asegurarse de que todos los cambios (incluyendo `build.sh` con permisos `+x`) estén commiteados y pusheados *dentro del repositorio del submódulo*.
        2.  Actualizar la referencia del submódulo en el repositorio principal (`git add apps/quranexpo-web`, `git commit`, `git push`).
        3.  Verificar la configuración de submódulos en Vercel (Settings -> Git -> Include Submodules).
        4.  La configuración de `vercel.json` podría entonces funcionar, pero el riesgo de error es mayor.

## Decisión Necesaria:
Se requiere una decisión del usuario sobre cómo proceder, ya que implica cambios estructurales en el repositorio. **La Opción 1 es fuertemente recomendada para la estabilidad y simplicidad del deployment.**

## Estado:
-   🆘 **CAUSA RAÍZ IDENTIFICADA:** `apps/quranexpo-web` es un **submódulo de Git**, lo que explica la mayoría de los problemas de build en Vercel.
-   🟡 Pendiente de decisión del usuario sobre cómo manejar el submódulo (integrar o mantener).
-   La documentación sobre este hallazgo se ha guardado en [`memory-bank/submodule-revelation-impact.md`](memory-bank/submodule-revelation-impact.md).