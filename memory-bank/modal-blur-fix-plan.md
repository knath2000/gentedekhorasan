# Plan Detallado: Corrección del Sistema de Blur del Modal

## Problema Identificado

El enfoque actual usando `backdrop-blur` y z-index no funciona porque:
- `backdrop-blur` solo afecta contenido DOM detrás del elemento, no basado en z-index
- El `BottomControlPanel` está fuera del alcance del backdrop
- El fondo se oscurece pero no se desenfoca

## Solución: Blur Global con Filter CSS

### Estrategia
Aplicar `filter: blur()` directamente a los elementos que queremos desenfocar cuando el modal esté abierto, controlado por clases CSS condicionales.

### Implementación

#### 1. Clases CSS (global.css)
```css
.modal-blur-content {
  filter: blur(4px);
  transition: filter 0.3s ease-out;
}
```

#### 2. Control de Blur (SurahDescriptionModal.tsx)
```tsx
useEffect(() => {
  const elements = [
    ...document.querySelectorAll('[data-verse-card]'),
    document.querySelector('[data-surah-header]'),
    document.querySelector('[data-bottom-panel]')
  ].filter(Boolean);

  if (isOpen) {
    elements.forEach(el => el?.classList.add('modal-blur-content'));
  } else {
    elements.forEach(el => el?.classList.remove('modal-blur-content'));
  }
}, [isOpen]);
```

#### 3. Data Attributes
- `BottomControlPanel`: `data-bottom-panel`
- `ReaderSurahHeader`: `data-surah-header`
- `ReaderVerseCard`: `data-verse-card`

#### 4. Backdrop Simplificado
```tsx
<div 
  className={`fixed inset-0 bg-skyDeepBlue/70 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
  onClick={onClose}
/>
```

### Resultado Esperado
- ✅ Fondo (versos) borroso cuando modal abierto
- ✅ BottomControlPanel borroso cuando modal abierto  
- ✅ Modal nítido y legible
- ✅ Transiciones suaves
- ✅ No dependencia de z-index para blur