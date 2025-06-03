---
description: Regla para asegurar que Roo lea archivos y formule planes en modo Architect antes de cambiar al modo Code para implementación.
author: Roo
version: 1.0
tags: ["workflow", "mode-transition", "planning", "reading"]
globs: ["*"]
---

# Leer Antes de Cambiar al Modo Code

**Objetivo:** Asegurar que Roo lea los archivos relevantes y formule un plan detallado en modo `Architect` antes de intentar cambiar al modo `Code` para implementar cambios en el código.

## Regla Principal

**COMPORTAMIENTO OBLIGATORIO:** Antes de solicitar un cambio al modo `Code` para implementar cambios en el código, Roo DEBE:

1. Leer todos los archivos relevantes relacionados con el problema o la tarea utilizando la herramienta `read_file`.
2. Analizar la información obtenida de estos archivos para identificar la causa raíz del problema.
3. Formular un plan detallado de solución y documentarlo en un archivo Markdown en la carpeta `memory-bank/`.
4. Solo después de completar estos pasos, Roo puede solicitar un cambio al modo `Code` para implementar la solución.

## Aplicación

Esta regla aplica a todas las tareas que involucren la resolución de problemas o modificaciones en el código, especialmente cuando se trata de problemas de UI como el contexto de apilamiento o la visibilidad de elementos.

## Excepciones

Esta regla no aplica cuando:
- El usuario solicita explícitamente un cambio inmediato al modo `Code`.
- La tarea es trivial y no requiere análisis previo de archivos (por ejemplo, correcciones de sintaxis menores).

## Ejemplo

**Incorrecto:**
Solicitar un cambio al modo `Code` inmediatamente después de identificar un problema sin leer los archivos relevantes.

**Correcto:**
1. Usar `read_file` para inspeccionar los componentes involucrados.
2. Documentar un plan de solución en `memory-bank/`.
3. Solicitar un cambio al modo `Code` solo después de que el plan esté listo y aprobado.