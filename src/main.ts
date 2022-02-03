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

function createListItem(classes: string[], text: string): HTMLLIElement {
  const item = document.createElement('li')
  item.classList.add(...classes)
  item.textContent = text
  return item
}

function recuresivelyCreateListTree(tree: IDS, ul: HTMLUListElement, level: number = 0): void {
  const levelClass = `level-${level}`
  if (tree.type === 'char') {
    const item = createListItem([], tree.char)
    ul.appendChild(item)
  } else {
    const head = createListItem([levelClass], tree.type)
    const childrenLisItem = createListItem([levelClass], '')
    const childrenList = document.createElement('ul')
    children(tree).forEach((child) => {
      const list = document.createElement('ul')
      recuresivelyCreateListTree(child, list, level + 1)
      childrenList.appendChild(list)
    })
    childrenLisItem.appendChild(childrenList)
    ul.appendChild(head)
    ul.appendChild(childrenLisItem)
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

  const treeContainer = document.querySelector<HTMLDivElement>('#tree-container')!
  const ul = document.createElement('ul')
  recuresivelyCreateListTree(rootIDS, ul)
  treeContainer.appendChild(ul)
}

document.querySelector<HTMLInputElement>('input')!.addEventListener('input', e => {
  appendVisualisedIDS((e.target as HTMLInputElement).value)
})

document.addEventListener('DOMContentLoaded', () => {
  appendVisualisedIDS('⿺辶⿳穴⿲月⿱⿲幺言幺⿲長馬長刂心')
})
