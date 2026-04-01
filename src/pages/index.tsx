import Lens from "@/components/lens"

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between py-16 px-16 bg-white dark:bg-black sm:items-start">
      <Lens endpoint="/api/ask" />
    </main>
  )
}
