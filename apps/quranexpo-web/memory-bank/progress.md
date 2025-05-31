# Progreso del Proyecto (quranexpo-web)

## Lo que funciona
- La funcionalidad de marcadores está operativa en el frontend.
- La interfaz de usuario para añadir/eliminar marcadores y editar notas está presente.

## Lo que queda por construir
- Verificación exhaustiva y testing de la funcionalidad de notas en el frontend después de los cambios aplicados.
- Implementación de cualquier mejora o característica adicional que surja del testing.

## Estado Actual
- Se han aplicado las correcciones necesarias para la funcionalidad de notas en la página de marcadores en el frontend.
- Se corrigió el mismatch de parámetros en la llamada a la API para actualizar marcadores en `src/services/apiClient.ts`.

## Problemas Conocidos
- No se han identificado problemas conocidos en el frontend después de los cambios, pero se requiere testing para confirmarlo.

## Evolución de las Decisiones del Proyecto
- La decisión de usar TursoDB para el almacenamiento de notas se ha reafirmado debido a su integración existente y eficiencia.
- Se ha priorizado la corrección de errores de integración sobre la implementación de nuevas características para asegurar la estabilidad del frontend.
