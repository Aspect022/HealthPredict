import { Navbar } from "@/components/navbar"

export default function DepressionPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton />
      <div className="container mx-auto max-w-4xl py-6 flex-1">
        <div className="rounded-lg border p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-bold">Student Depression Assessment</h1>
          <p className="mb-8 text-muted-foreground">
            This form will be implemented to evaluate depression symptoms in students.
          </p>
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
            <p className="text-muted-foreground">Form will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
