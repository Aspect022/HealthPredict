"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Navbar } from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  gender: string;
  age: string;
  city: string;
  academic_pressure: string;
  cgpa: string;
  study_satisfaction: string;
  sleep_duration: string;
  dietary_habits: string;
  new_degree: string;
  suicidal_thoughts: string;
  work_study_hours: string;
  financial_stress: string;
  family_history: string;
}

interface PredictionResult {
  prediction: number;
  risk_status?: string;
  probability?: number;
}

export default function DepressionPage() {
  const [activeTab, setActiveTab] = useState("form");
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    gender: "0", // Default to Female
    age: "",
    city: "",
    academic_pressure: "3", // Default to middle value
    cgpa: "",
    study_satisfaction: "3", // Default to middle value
    sleep_duration: "2", // Default to 7-8 hours
    dietary_habits: "1", // Default to Moderate
    new_degree: "0", // Default to Graduated
    suicidal_thoughts: "0", // Default to No
    work_study_hours: "",
    financial_stress: "3", // Default to middle value
    family_history: "0", // Default to No
  });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [summary, setSummary] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { age, cgpa, work_study_hours } = formData;

    if (!age || isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      setError("Please enter a valid age between 1 and 120");
      return false;
    }

    if (!cgpa || isNaN(Number(cgpa)) || Number(cgpa) < 0 || Number(cgpa) > 10) {
      setError("Please enter a valid CGPA between 0 and 10");
      return false;
    }

    if (
      !work_study_hours ||
      isNaN(Number(work_study_hours)) ||
      Number(work_study_hours) < 0 ||
      Number(work_study_hours) > 24
    ) {
      setError("Please enter valid work/study hours between 0 and 24");
      return false;
    }

    return true;
  };

  const { isAuthenticated } = useAuth();

  const fetchAISummary = async (predictionData: PredictionResult) => {
    setIsSummaryLoading(true);

    try {
      const parameters = {
        gender: Number.parseInt(formData.gender),
        age: Number.parseFloat(formData.age),
        city: formData.city,
        academic_pressure: Number.parseInt(formData.academic_pressure),
        cgpa: Number.parseFloat(formData.cgpa),
        study_satisfaction: Number.parseInt(formData.study_satisfaction),
        sleep_duration: Number.parseInt(formData.sleep_duration),
        dietary_habits: Number.parseInt(formData.dietary_habits),
        new_degree: Number.parseInt(formData.new_degree),
        suicidal_thoughts: Number.parseInt(formData.suicidal_thoughts),
        work_study_hours: Number.parseFloat(formData.work_study_hours),
        financial_stress: Number.parseInt(formData.financial_stress),
        family_history: Number.parseInt(formData.family_history),
      };

      const summaryResponse = await fetch("/api/ai-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disease: "depression",
          parameters,
          prediction: predictionData.prediction,
          probability: predictionData.probability || 0.5,
        }),
      });

      if (!summaryResponse.ok) {
        throw new Error("Failed to get AI summary");
      }

      const summaryData = await summaryResponse.json();
      setSummary(summaryData.summary);
    } catch (err) {
      console.error("Error fetching AI summary:", err);
      setSummary("Unable to generate summary. Please try again later.");
    } finally {
      setIsSummaryLoading(false);
    }
  };

  useEffect(() => {
    if (result && activeTab === "results") {
      fetchAISummary(result);
    }
  }, [result, activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (!isAuthenticated) {
        throw new Error("You must be logged in to access this feature");
      }

      const apiData = {
        gender: Number.parseInt(formData.gender),
        age: Number.parseFloat(formData.age),
        city: formData.city,
        academic_pressure: Number.parseInt(formData.academic_pressure),
        cgpa: Number.parseFloat(formData.cgpa),
        study_satisfaction: Number.parseInt(formData.study_satisfaction),
        sleep_duration: Number.parseInt(formData.sleep_duration),
        dietary_habits: Number.parseInt(formData.dietary_habits),
        new_degree: Number.parseInt(formData.new_degree),
        suicidal_thoughts: Number.parseInt(formData.suicidal_thoughts),
        work_study_hours: Number.parseFloat(formData.work_study_hours),
        financial_stress: Number.parseInt(formData.financial_stress),
        family_history: Number.parseInt(formData.family_history),
      };
      console.log("Submitting form with data:", apiData);

      const predictionResponse = await fetch(
        "http://localhost:8000/predict/depression",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!predictionResponse.ok) {
        throw new Error("Failed to get prediction from the model");
      }

      const predictionData = await predictionResponse.json();
      setResult(predictionData);

      setActiveTab("results");
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing your request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton />
      <div className="container mx-auto max-w-4xl py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Depression Risk Assessment</h1>

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
                    <div>
                      <Label className="text-base font-medium">Gender</Label>
                      <RadioGroup
                        value={formData.gender}
                        onValueChange={(value) =>
                          handleRadioChange("gender", value)
                        }
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="gender-female" />
                          <Label htmlFor="gender-female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="gender-male" />
                          <Label htmlFor="gender-male">Male</Label>
                        </div>
                      </RadioGroup>
                    </div>

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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="academic_pressure">
                        Academic Pressure (1-5)
                      </Label>
                      <Select
                        value={formData.academic_pressure}
                        onValueChange={(value) =>
                          handleSelectChange("academic_pressure", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 (Very Low)</SelectItem>
                          <SelectItem value="2">2 (Low)</SelectItem>
                          <SelectItem value="3">3 (Moderate)</SelectItem>
                          <SelectItem value="4">4 (High)</SelectItem>
                          <SelectItem value="5">5 (Very High)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cgpa">CGPA</Label>
                      <Input
                        id="cgpa"
                        name="cgpa"
                        type="number"
                        placeholder="Enter your CGPA"
                        value={formData.cgpa}
                        onChange={handleInputChange}
                        min="0"
                        max="10"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="study_satisfaction">
                        Study Satisfaction (1-5)
                      </Label>
                      <Select
                        value={formData.study_satisfaction}
                        onValueChange={(value) =>
                          handleSelectChange("study_satisfaction", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">
                            1 (Very Dissatisfied)
                          </SelectItem>
                          <SelectItem value="2">2 (Dissatisfied)</SelectItem>
                          <SelectItem value="3">3 (Neutral)</SelectItem>
                          <SelectItem value="4">4 (Satisfied)</SelectItem>
                          <SelectItem value="5">5 (Very Satisfied)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sleep_duration">Sleep Duration</Label>
                      <Select
                        value={formData.sleep_duration}
                        onValueChange={(value) =>
                          handleSelectChange("sleep_duration", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Less than 5 hours</SelectItem>
                          <SelectItem value="1">5-6 hours</SelectItem>
                          <SelectItem value="2">7-8 hours</SelectItem>
                          <SelectItem value="3">More than 8 hours</SelectItem>
                          <SelectItem value="4">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dietary_habits">Dietary Habits</Label>
                      <Select
                        value={formData.dietary_habits}
                        onValueChange={(value) =>
                          handleSelectChange("dietary_habits", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select habits" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Unhealthy</SelectItem>
                          <SelectItem value="1">Moderate</SelectItem>
                          <SelectItem value="2">Healthy</SelectItem>
                          <SelectItem value="3">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new_degree">Education Level</Label>
                      <Select
                        value={formData.new_degree}
                        onValueChange={(value) =>
                          handleSelectChange("new_degree", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Graduated</SelectItem>
                          <SelectItem value="1">Post Graduated</SelectItem>
                          <SelectItem value="2">Higher Secondary</SelectItem>
                          <SelectItem value="3">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium">
                        Have you ever had suicidal thoughts?
                      </Label>
                      <RadioGroup
                        value={formData.suicidal_thoughts}
                        onValueChange={(value) =>
                          handleRadioChange("suicidal_thoughts", value)
                        }
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="suicidal-no" />
                          <Label htmlFor="suicidal-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="suicidal-yes" />
                          <Label htmlFor="suicidal-yes">Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="work_study_hours">
                        Work/Study Hours per day
                      </Label>
                      <Input
                        id="work_study_hours"
                        name="work_study_hours"
                        type="number"
                        placeholder="Enter hours"
                        value={formData.work_study_hours}
                        onChange={handleInputChange}
                        min="0"
                        max="24"
                        step="0.5"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="financial_stress">
                        Financial Stress (1-5)
                      </Label>
                      <Select
                        value={formData.financial_stress}
                        onValueChange={(value) =>
                          handleSelectChange("financial_stress", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 (Very Low)</SelectItem>
                          <SelectItem value="2">2 (Low)</SelectItem>
                          <SelectItem value="3">3 (Moderate)</SelectItem>
                          <SelectItem value="4">4 (High)</SelectItem>
                          <SelectItem value="5">5 (Very High)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-base font-medium">
                        Family History of Mental Illness
                      </Label>
                      <RadioGroup
                        value={formData.family_history}
                        onValueChange={(value) =>
                          handleRadioChange("family_history", value)
                        }
                        className="flex flex-row gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="family-history-no" />
                          <Label htmlFor="family-history-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="family-history-yes" />
                          <Label htmlFor="family-history-yes">Yes</Label>
                        </div>
                      </RadioGroup>
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
                    <h2 className="text-2xl font-bold mb-2">
                      Assessment Results
                    </h2>
                    <div
                      className={`text-3xl font-bold ${
                        result.prediction === 1
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {result.risk_status ||
                        (result.prediction === 1
                          ? "High Risk of Depression"
                          : "Low Risk of Depression")}
                    </div>
                    {result.probability !== undefined && (
                      <p className="mt-2 text-lg">
                        Confidence: {(result.probability * 100).toFixed(2)}%
                      </p>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
                    {isSummaryLoading ? (
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : summary ? (
                      <div className="text-muted-foreground whitespace-pre-wrap">
                        {summary}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        No analysis available. Please try again later.
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-xl font-semibold mb-3">
                      Your Assessment Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Gender:</p>
                        <p className="text-muted-foreground">
                          {formData.gender === "0" ? "Female" : "Male"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Age:</p>
                        <p className="text-muted-foreground">
                          {formData.age} years
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">City:</p>
                        <p className="text-muted-foreground">{formData.city}</p>
                      </div>
                      <div>
                        <p className="font-medium">Academic Pressure:</p>
                        <p className="text-muted-foreground">
                          {formData.academic_pressure} out of 5
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">CGPA:</p>
                        <p className="text-muted-foreground">{formData.cgpa}</p>
                      </div>
                      <div>
                        <p className="font-medium">Study Satisfaction:</p>
                        <p className="text-muted-foreground">
                          {formData.study_satisfaction} out of 5
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Sleep Duration:</p>
                        <p className="text-muted-foreground">
                          {formData.sleep_duration === "0"
                            ? "Less than 5 hours"
                            : formData.sleep_duration === "1"
                            ? "5-6 hours"
                            : formData.sleep_duration === "2"
                            ? "7-8 hours"
                            : formData.sleep_duration === "3"
                            ? "More than 8 hours"
                            : "Others"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Dietary Habits:</p>
                        <p className="text-muted-foreground">
                          {formData.dietary_habits === "0"
                            ? "Unhealthy"
                            : formData.dietary_habits === "1"
                            ? "Moderate"
                            : formData.dietary_habits === "2"
                            ? "Healthy"
                            : "Others"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Education Level:</p>
                        <p className="text-muted-foreground">
                          {formData.new_degree === "0"
                            ? "Graduated"
                            : formData.new_degree === "1"
                            ? "Post Graduated"
                            : formData.new_degree === "2"
                            ? "Higher Secondary"
                            : "Others"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Suicidal Thoughts:</p>
                        <p className="text-muted-foreground">
                          {formData.suicidal_thoughts === "1" ? "Yes" : "No"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Work/Study Hours:</p>
                        <p className="text-muted-foreground">
                          {formData.work_study_hours} hours per day
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Financial Stress:</p>
                        <p className="text-muted-foreground">
                          {formData.financial_stress} out of 5
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">
                          Family History of Mental Illness:
                        </p>
                        <p className="text-muted-foreground">
                          {formData.family_history === "1" ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("form")}
                    >
                      Back to Form
                    </Button>
                    <Button
                      onClick={() => {
                        setFormData({
                          gender: "0",
                          age: "",
                          city: "",
                          academic_pressure: "3",
                          cgpa: "",
                          study_satisfaction: "3",
                          sleep_duration: "2",
                          dietary_habits: "1",
                          new_degree: "0",
                          suicidal_thoughts: "0",
                          work_study_hours: "",
                          financial_stress: "3",
                          family_history: "0",
                        });
                        setResult(null);
                        setSummary("");
                        setActiveTab("form");
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
  );
}
