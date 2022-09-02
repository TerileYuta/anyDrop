import React from 'react';

export const H1 = (props) => {
  return (
    <h1 className={`text-5xl font-bold mt-3  ${props.addClass}`}>{props.text}</h1>
  )
}

export const H2 = (props) => {
  return (
    <h1 className={`text-3xl font-bold mt-3  ${props.addClass}`}>{props.text}</h1>
  )
}

export const H3 = (props) => {
  return (
    <h1 className={`text-xl font-bold mt-3 ${props.addClass}`}>{props.text}</h1>
  )
}

export const P = (props) => {
  return (
    <p className={`text-lg mt-2  ${props.addClass}`}>{props.text}</p>
  )
}

export const PLink = (props) => {
  return (
    <p className={`text-lg mt-2 text-blue-400 hover:underline ${props.addClass}`}>{props.text}</p>
  )
}

export const TextBold = (props) => {
  return (
    <p className={`text-base font-bold mt-2 ${props.addClass}`}>{props.text}</p>
  )
}

export const Text = (props) => {
  return (
    <p className={`text-base mt-2  ${props.addClass}`}>{props.text}</p>
  )
}

