"use client"

import { useState, useEffect } from "react"
import { ChevronRight, X } from "lucide-react"
import { ApplicationForm } from "../application-component/application-form"


export default function ApplicationModal({ 
  triggerText = "Apply Now", 
 
  className 
}: { 
  triggerText?: string
  children?: React.ReactNode
  className?: string 
}) {
const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
className={`inline-flex items-center gap-2 border border-gray-300 hover:border-gray-900/20 text-gray-900 text-sm font-medium px-6 py-2 rounded-lg transition-all ${className || ""}`}
      >
        {triggerText}
        <ChevronRight className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
className="fixed inset-0 bg-gray-900/50 z-40 flex items-center justify-center p-4 overflow-hidden" onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Cohort Application
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 pb-12">
                <ApplicationForm />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

