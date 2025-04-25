"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FormData {
  age: string
  sex: string
  ALB: string
  CHE: string
  CHOL: string
  CREA_log: string
  BIL_log: string
  ALT_log: string
  GGT_log: string
  AST_log: string
  ALP_log: string
}

interface PredictionResult {
  prediction: number
  risk_status?: string
  probability?: number
}

export default function HepatitisPage() {
  const [activeTab, setActiveTab] = useState("form")
  const [isLoading, setIsLoading] = useState(false)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    age: "",
    sex: "0", // Default to Female
    ALB: "",
    CHE: "",
    CHOL: "",
    CREA_log: "",
    BIL_log: "",
    ALT_log: "",
    GGT_log: "",
    AST_log: "",
    ALP_log: "",
  })
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [summary, setSummary] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const { age, ALB, CHE, CHOL, CREA_log, BIL_log, ALT_log, GGT_log, AST_log, ALP_log } = formData

    if (!age || isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      setError("Please enter a valid age between 1 and 120")
      return false
    }

    if (!ALB || isNaN(Number(ALB))) {
      setError("Please enter a valid ALB value")
      return false
    }

    if (!CHE || isNaN(Number(CHE))) {
      setError("Please enter a valid CHE value")
      return false
    }

    if (!CHOL || isNaN(Number(CHOL))) {
      setError("Please enter a valid CHOL value")
      return false
    }

    if (!CREA_log || isNaN(Number(CREA_log))) {
      setError("Please enter a valid CREA_log value")
      return false
    }

    if (!BIL_log || isNaN(Number(BIL_log))) {
      setError("Please enter a valid BIL_log value")
      return false
    }

    if (!ALT_log || isNaN(Number(ALT_log))) {
      setError("Please enter a valid ALT_log value")
      return false
    }

    if (!GGT_log || isNaN(Number(GGT_log))) {
      setError("Please enter a valid GGT_log value")
      return false
    }

    if (!AST_log || isNaN(Number(AST_log))) {
      setError("Please enter a valid AST_log value")
      return false
    }

    if (!ALP_log || isNaN(Number(ALP_log))) {
      setError("Please enter a valid ALP_log value")
      return false
    }

    return true
  }

  const { isAuthenticated } = useAuth()

  const fetchAISummary = async (predictionData: PredictionResult) => {
    setIsSummaryLoading(true)

    try {
      const apiData = {
        age: Number.parseInt(formData.age),
        sex: Number.parseInt(formData.sex),
        alb: Number.parseFloat(formData.ALB),  // Changed from ALB to alb
        che: Number.parseFloat(formData.CHE),  // Changed from CHE to che
        chol: Number.parseFloat(formData.CHOL),  // Changed from CHOL to chol
        crea_log: Number.parseFloat(formData.CREA_log),  // Keep lowercase and underscore
        bil_log: Number.parseFloat(formData.BIL_log),  // Keep lowercase and underscore
        alt_log: Number.parseFloat(formData.ALT_log),  // Keep lowercase and underscore
        ggt_log: Number.parseFloat(formData.GGT_log),  // Keep lowercase and underscore
        ast_log: Number.parseFloat(formData.AST_log),  // Keep lowercase and underscore
        alp_log: Number.parseFloat(formData.ALP_log),  // Keep lowercase and underscore
      
      }

      const summaryResponse = await fetch("/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disease: "hepatitis",
          parameters: apiData,
          prediction: predictionData.prediction,
          probability: predictionData.probability || 0.5,
        }),
      })

      if (!summaryResponse.ok) {
        throw new Error("Failed to get AI summary")
      }

      const summaryData = await summaryResponse.json()
      setSummary(summaryData.summary)
    } catch (err) {
      console.error("Error fetching AI summary:", err)
      setSummary("Unable to generate summary. Please try again later.")
    } finally {
      setIsSummaryLoading(false)
    }
  }

  useEffect(() => {
    if (result && activeTab === "results") {
      fetchAISummary(result)
    }
  }, [result, activeTab])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      if (!isAuthenticated) {
        throw new Error("You must be logged in to access this feature")
      }

      const apiData = {
        age: Number.parseFloat(formData.age),
        sex: Number.parseInt(formData.sex),
        ALB: Number.parseFloat(formData.ALB),
        CHE: Number.parseFloat(formData.CHE),
        CHOL: Number.parseFloat(formData.CHOL),
        CREA_log: Number.parseFloat(formData.CREA_log),
        BIL_log: Number.parseFloat(formData.BIL_log),
        ALT_log: Number.parseFloat(formData.ALT_log),
        GGT_log: Number.parseFloat(formData.GGT_log),
        AST_log: Number.parseFloat(formData.AST_log),
        ALP_log: Number.parseFloat(formData.ALP_log),
      }
      console.log("Submitting form with data:", apiData)

      const predictionResponse = await fetch("http://localhost:8000/predict/hepatitis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!predictionResponse.ok) {
        throw new Error("Failed to get prediction from the model")
      }

      const predictionData = await predictionResponse.json()
      setResult(predictionData)

      setActiveTab("results")
    } catch (err) {
      console.error("Error submitting form:", err)
      setError(err instanceof Error ? err.message : "An error occurred while processing your request")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton />
      <div className="container mx-auto max-w-4xl py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Hepatitis Risk Assessment</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Assessment Form</TabsTrigger>
            <TabsTrigger value="results" disabled={!result}>
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <Card className="p-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="1"
                        max="120"
                        step="1"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium">Sex</Label>
                      <RadioGroup
                        value={formData.sex}
                        onValueChange={(value) => handleRadioChange("sex", value)}
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="sex-female" />
                          <Label htmlFor="sex-female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="sex-male" />
                          <Label htmlFor="sex-male">Male</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ALB">ALB (Albumin)</Label>
                      <Input
                        id="ALB"
                        name="ALB"
                        type="number"
                        placeholder="Enter ALB value"
                        value={formData.ALB}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="CHE">CHE (Cholinesterase)</Label>
                      <Input
                        id="CHE"
                        name="CHE"
                        type="number"
                        placeholder="Enter CHE value"
                        value={formData.CHE}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="CHOL">CHOL (Cholesterol)</Label>
                      <Input
                        id="CHOL"
                        name="CHOL"
                        type="number"
                        placeholder="Enter CHOL value"
                        value={formData.CHOL}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="CREA_log">CREA_log (Creatinine log)</Label>
                      <Input
                        id="CREA_log"
                        name="CREA_log"
                        type="number"
                        placeholder="Enter CREA_log value"
                        value={formData.CREA_log}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="BIL_log">BIL_log (Bilirubin log)</Label>
                      <Input
                        id="BIL_log"
                        name="BIL_log"
                        type="number"
                        placeholder="Enter BIL_log value"
                        value={formData.BIL_log}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ALT_log">ALT_log (Alanine Transaminase log)</Label>
                      <Input
                        id="ALT_log"
                        name="ALT_log"
                        type="number"
                        placeholder="Enter ALT_log value"
                        value={formData.ALT_log}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="GGT_log">GGT_log (Gamma-Glutamyl Transferase log)</Label>
                      <Input
                        id="GGT_log"
                        name="GGT_log"
                        type="number"
                        placeholder="Enter GGT_log value"
                        value={formData.GGT_log}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="AST_log">AST_log (Aspartate Aminotransferase log)</Label>
                      <Input
                        id="AST_log"
                        name="AST_log"
                        type="number"
                        placeholder="Enter AST_log value"
                        value={formData.AST_log}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ALP_log">ALP_log (Alkaline Phosphatase log)</Label>
                      <Input
                        id="ALP_log"
                        name="ALP_log"
                        type="number"
                        placeholder="Enter ALP_log value"
                        value={formData.ALP_log}
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Assessment"
                  )}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            {result && (
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Assessment Results</h2>
                    <div
                      className={`text-3xl font-bold ${result.prediction === 1 ? "text-red-500" : "text-green-500"}`}
                    >
                      {result.risk_status ||
                        (result.prediction === 1 ? "High Risk of Hepatitis" : "Low Risk of Hepatitis")}
                    </div>
                    {result.probability !== undefined && (
                      <p className="mt-2 text-lg">Confidence: {(result.probability * 100).toFixed(2)}%</p>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
                    {isSummaryLoading ? (
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : summary ? (
                      <div className="text-muted-foreground whitespace-pre-wrap">{summary}</div>
                    ) : (
                      <div className="text-muted-foreground">No analysis available. Please try again later.</div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-xl font-semibold mb-3">Your Assessment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Age:</p>
                        <p className="text-muted-foreground">{formData.age} years</p>
                      </div>
                      <div>
                        <p className="font-medium">Sex:</p>
                        <p className="text-muted-foreground">{formData.sex === "0" ? "Female" : "Male"}</p>
                      </div>
                      <div>
                        <p className="font-medium">ALB (Albumin):</p>
                        <p className="text-muted-foreground">{formData.ALB}</p>
                      </div>
                      <div>
                        <p className="font-medium">CHE (Cholinesterase):</p>
                        <p className="text-muted-foreground">{formData.CHE}</p>
                      </div>
                      <div>
                        <p className="font-medium">CHOL (Cholesterol):</p>
                        <p className="text-muted-foreground">{formData.CHOL}</p>
                      </div>
                      <div>
                        <p className="font-medium">CREA_log (Creatinine log):</p>
                        <p className="text-muted-foreground">{formData.CREA_log}</p>
                      </div>
                      <div>
                        <p className="font-medium">BIL_log (Bilirubin log):</p>
                        <p className="text-muted-foreground">{formData.BIL_log}</p>
                      </div>
                      <div>
                        <p className="font-medium">ALT_log (Alanine Transaminase log):</p>
                        <p className="text-muted-foreground">{formData.ALT_log}</p>
                      </div>
                      <div>
                        <p className="font-medium">GGT_log (Gamma-Glutamyl Transferase log):</p>
                        <p className="text-muted-foreground">{formData.GGT_log}</p>
                      </div>
                      <div>
                        <p className="font-medium">AST_log (Aspartate Aminotransferase log):</p>
                        <p className="text-muted-foreground">{formData.AST_log}</p>
                      </div>
                      <div>
                        <p className="font-medium">ALP_log (Alkaline Phosphatase log):</p>
                        <p className="text-muted-foreground">{formData.ALP_log}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("form")}>
                      Back to Form
                    </Button>
                    <Button
                      onClick={() => {
                        setFormData({
                          age: "",
                          sex: "0",
                          ALB: "",
                          CHE: "",
                          CHOL: "",
                          CREA_log: "",
                          BIL_log: "",
                          ALT_log: "",
                          GGT_log: "",
                          AST_log: "",
                          ALP_log: "",
                        })
                        setResult(null)
                        setSummary("")
                        setActiveTab("form")
                      }}
                    >
                      Start New Assessment
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
