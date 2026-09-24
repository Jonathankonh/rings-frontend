// src/colors.js
// Maps a ring's stored color name to its CSS variable. Used by RingProgress
// and the task list (colored dot per category). One place, same rule
// everywhere: green is reserved for "ring is full", never a category color.
export function colorVarFor(colorName) {
    const map = { purple: 'var(--purple)', blue: 'var(--blue)', red: 'var(--red)', yellow: 'var(--yellow)' }
    return map[colorName] || 'var(--purple)'
}