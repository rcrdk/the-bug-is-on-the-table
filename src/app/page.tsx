'use client'

import { useState } from 'react'

import { BugTable } from '../components/bug-table'
import { Header } from '../components/header'

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false)
  const [smashedCount, setSmashedCount] = useState(0)

  return (
    <>
      <Header hidden={!hasStarted} smashedCount={smashedCount} />
      <BugTable onStart={() => setHasStarted(true)} onSmashedCountChange={setSmashedCount} />
    </>
  )
}
