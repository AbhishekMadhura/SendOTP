"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, MessageCircle, Loader2, Lock } from "lucide-react"

export default function ForgotPasswordFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [username, setUsername] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const nextStep = () => setCurrentStep((prev) => prev + 1)

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

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
    const otpString = otp.join("")
    if (otpString.length !== 6) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("https://abhishekmadhura.app.n8n.cloud/webhook/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          otp: otpString,
        }),
      })

      const data = await response.json()

      if (data.success === true) {
        console.log("OTP verified successfully for:", username)
        setSuccessMessage("OTP Verified! You can now reset your password.")
        nextStep()
      } else {
        throw new Error(data.message || "Invalid OTP")
      }
    } catch (err) {
      console.error("Error verifying OTP:", err)
      setError(err.message || "Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Please fill in both password fields.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // This can be connected to your backend API
      console.log("Resetting password for:", username)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccessMessage("Password reset successfully!")
    } catch (err) {
      console.error("Error resetting password:", err)
      setError("Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border border-gray-800 bg-gray-900/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-white to-gray-300 rounded-full flex items-center justify-center mb-4">
            {currentStep === 1 && <MessageCircle className="w-8 h-8 text-black" />}
            {currentStep === 2 && <Send className="w-8 h-8 text-black" />}
            {currentStep === 3 && <Lock className="w-8 h-8 text-black" />}
          </div>

          {currentStep === 1 && (
            <>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Enter Username
              </CardTitle>
              <CardDescription className="text-gray-300">
                Enter your username or email to receive OTP via Telegram
              </CardDescription>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Enter OTP
              </CardTitle>
              <CardDescription className="text-gray-300">Enter the OTP you received on Telegram</CardDescription>
            </>
          )}

          {currentStep === 3 && (
            <>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Reset Password
              </CardTitle>
              <CardDescription className="text-gray-300">Create your new password</CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder:text-gray-400 focus:border-white transition-all duration-300"
                disabled={isLoading}
              />
              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/30 border border-red-800 p-2 rounded-lg">
                  {error}
                </div>
              )}
              <Button
                onClick={handleSendOTP}
                disabled={!username.trim() || isLoading}
                className="w-full h-12 bg-gradient-to-r from-white to-gray-300 hover:from-gray-100 hover:to-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
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

              <div className="text-center text-sm text-gray-400 bg-gray-800/50 border border-gray-700 p-3 rounded-lg">
                <p className="mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Use this link to start our bot to get services from Instacks and getting OTPs
                </p>
                <a
                  href="https://t.me/instacksautomationbot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  Click here: t.me/instacksautomationbot
                </a>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-mono rounded-lg border-2 border-gray-700 bg-gray-800 text-white focus:border-white transition-all duration-300"
                    disabled={isLoading}
                  />
                ))}
              </div>
              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/30 border border-red-800 p-2 rounded-lg">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="text-green-400 text-sm text-center bg-green-900/30 border border-green-800 p-2 rounded-lg">
                  {successMessage}
                </div>
              )}
              <Button
                onClick={handleVerifyOTP}
                disabled={otp.join("").length !== 6 || isLoading}
                className="w-full h-12 bg-gradient-to-r from-white to-gray-300 hover:from-gray-100 hover:to-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying OTP...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder:text-gray-400 focus:border-white transition-all duration-300"
                disabled={isLoading}
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder:text-gray-400 focus:border-white transition-all duration-300"
                disabled={isLoading}
              />
              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/30 border border-red-800 p-2 rounded-lg">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="text-green-400 text-sm text-center bg-green-900/30 border border-green-800 p-2 rounded-lg">
                  {successMessage}
                </div>
              )}
              <Button
                onClick={handleResetPassword}
                disabled={!newPassword.trim() || !confirmPassword.trim() || isLoading}
                className="w-full h-12 bg-gradient-to-r from-white to-gray-300 hover:from-gray-100 hover:to-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </Button>
            </div>
          )}

          {currentStep > 1 && (
            <Button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
            >
              ← Back
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
