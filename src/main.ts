import './style.css'

import { parse, children } from 'parse-ids'
import type { IDS } from 'parse-ids'

function createSpan(classes: string[], text: string) {
  const span = document.createElement('span')
  span.classList.add(...classes)
  span.textContent = text
  return span
}

function recursivelyCreateSpanFromTree(tree: IDS, level: number = 0): HTMLSpanElement[] {
  const levelClass = `level-${level}`
  if (tree.type === 'char') {
    return [createSpan([], tree.char)]
  } else {
    const head = createSpan([levelClass], tree.type)
    const childs = children(tree).flatMap((child) => recursivelyCreateSpanFromTree(child, level + 1))
    const childrenContainer = createSpan([levelClass, 'uline'], '')
    childs.forEach((child) => childrenContainer.appendChild(child))
    return [head, childrenContainer]
  }
}

function appendVisualisedIDS(ids: string) {
  const container = document.querySelector<HTMLDivElement>('#ids-container')!
  const rootIDS = parse(ids)
  if (rootIDS === null) container.textContent = 'Invalid IDS!!'
  console.log(rootIDS)
  container.innerHTML = ''
  container.classList.add('container')
  recursivelyCreateSpanFromTree(rootIDS).forEach((span) => container.appendChild(span))
  document.body.appendChild(container)
}

document.querySelector<HTMLInputElement>('input')!.addEventListener('input', e => {
  appendVisualisedIDS((e.target as HTMLInputElement).value)
})

document.addEventListener('DOMContentLoaded', (e) => {
  appendVisualisedIDS('⿺辶⿳穴⿲月⿱⿲幺言幺⿲長馬長刂心')
})
 