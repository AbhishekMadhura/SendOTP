"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Send, MessageCircle, Loader2 } from "lucide-react"

export default function ForgotPasswordFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [username, setUsername] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const nextStep = () => setCurrentStep((prev) => prev + 1)

  const handleSendOTP = async () => {
    if (!username.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("https://abhishekmadhura.app.n8n.cloud/webhook/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.trim() }),
      })

      if (response.ok) {
        console.log("OTP sent successfully to:", username)
        nextStep()
      } else {
        throw new Error("Failed to send OTP")
      }
    } catch (err) {
      console.error("Error sending OTP:", err)
      setError("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    // Here you would call your API/webhook to verify OTP
    console.log("Verifying OTP:", otp)
    nextStep()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>

          {currentStep === 1 && (
            <>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Forgot Password?
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Reset securely via Telegram OTP
              </CardDescription>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Start Telegram Bot</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Start our Telegram bot to get updates and receive OTPs for password reset.
              </CardDescription>
            </>
          )}

          {currentStep === 3 && (
            <>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Enter Your Details</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                We'll send an OTP to your Telegram account
              </CardDescription>
            </>
          )}

          {currentStep === 4 && (
            <>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Verify OTP</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Enter the OTP sent to your Telegram
              </CardDescription>
            </>
          )}

          {currentStep === 5 && (
            <>
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                OTP Verified Successfully!
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                You can now reset your password.
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <Button
                onClick={nextStep}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Forget Password
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <Button
                onClick={nextStep}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                asChild
              >
                <a
                  href="https://t.me/instacksautomationbot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Telegram Bot
                </a>
              </Button>
              <Button
                onClick={nextStep}
                variant="outline"
                className="w-full h-12 border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 bg-transparent"
              >
                I've Started the Bot
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 rounded-lg border-2 focus:border-blue-500 transition-all duration-300"
                disabled={isLoading}
              />
              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                  {error}
                </div>
              )}
              <Button
                onClick={handleSendOTP}
                disabled={!username.trim() || isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send OTP
                  </>
                )}
              </Button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="h-12 rounded-lg border-2 focus:border-blue-500 transition-all duration-300 text-center text-lg font-mono"
                maxLength={6}
              />
              <Button
                onClick={handleVerifyOTP}
                disabled={!otp.trim()}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Verify OTP
              </Button>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <Button
                onClick={() => console.log("Redirecting to reset password...")}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Reset Password
              </Button>
            </div>
          )}

          {currentStep > 1 && currentStep < 5 && (
            <Button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              variant="ghost"
              className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-300"
            >
              ← Back
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
