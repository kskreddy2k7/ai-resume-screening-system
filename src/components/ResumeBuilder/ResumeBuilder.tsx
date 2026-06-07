import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, ChevronLeft, Download, FileText, 
  User, GraduationCap, Code, Briefcase, Award, Sparkles, Layout, FolderGit, Check, Eye, X
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import axios from 'axios'

const resumeSchema = z.object({
  personal: z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string(),
    location: z.string(),
    linkedin: z.string(),
    github: z.string(),
    portfolio: z.string()
  }),
  summary: z.string().max(600, "Summary must be less than 600 characters"),
  experience: z.array(z.object({
    company: z.string(),
    role: z.string(),
    duration: z.string(),
    responsibilities: z.string()
  })),
  education: z.array(z.object({
    college: z.string(),
    degree: z.string(),
    cgpa: z.string(),
    year: z.string()
  })),
  skills: z.string(),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string().max(500, "Description must be less than 500 characters"),
    technologies: z.string(),
    link: z.string()
  })),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    year: z.string()
  })),
  template: z.string()
})

type ResumeFormValues = z.infer<typeof resumeSchema>

export function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showPreview, setShowPreview] = useState(false)

  const steps = [
    { id: 'personal', title: 'Personal', icon: User },
    { id: 'education', title: 'Education', icon: GraduationCap },
    { id: 'skills', title: 'Skills', icon: Code },
    { id: 'projects', title: 'Projects', icon: FolderGit },
    { id: 'experience', title: 'Experience', icon: Briefcase },
    { id: 'certifications', title: 'Certificates', icon: Award },
    { id: 'summary', title: 'Summary', icon: Sparkles },
    { id: 'template', title: 'Templates', icon: Layout }
  ]

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      personal: { name: 'Alex Rivera', email: 'alex.rivera@example.com', phone: '+1 (555) 019-2834', location: 'San Francisco, CA', linkedin: 'https://linkedin.com/in/alexrivera', github: 'https://github.com/alexrivera', portfolio: 'https://alexrivera.dev' },
      summary: 'Senior Software Engineer with 5+ years of experience specializing in full-stack web applications, scalable cloud infrastructure, and responsive design systems. Passionate about writing clean, maintainable code and mentoring engineering teams.',
      experience: [
        { company: 'Stripe', role: 'Senior Software Engineer', duration: '2023 - Present', responsibilities: 'Led development of checkout orchestration service handling millions in daily volume. Re-architected frontend components using React and TypeScript, boosting core web vitals by 24%. Collaborated with product teams to scope new developer API features.' },
        { company: 'Linear', role: 'Software Engineer', duration: '2021 - 2023', responsibilities: 'Developed keyboard navigation layouts and real-time syncing pipelines. Optimised indexedDB queries reducing local app latency. Participated in daily architectural design iterations.' }
      ],
      education: [
        { college: 'Stanford University', degree: 'B.S. Computer Science', cgpa: '3.92', year: '2017 - 2021' }
      ],
      skills: 'TypeScript, JavaScript, React, Node.js, Python, PostgreSQL, MongoDB, Redis, AWS (S3, EC2, Lambda), Docker, Kubernetes, Git, CI/CD pipelines',
      projects: [
        { name: 'TalentFlow AI Client', description: 'Interactive AI resume parsing dashboard providing structural keyword optimization and real-time suggestions.', technologies: 'React, TypeScript, Framer Motion, Tailwind', link: 'https://github.com/alexrivera/talentflow' }
      ],
      certifications: [
        { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2024' }
      ],
      template: 'tech-indigo'
    }
  })

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "experience" })
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education" })
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control, name: "projects" })
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: "certifications" })

  const { user } = useAuthStore()

  // Load step query param if template selection clicked from header
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stepParam = params.get('step')
    if (stepParam) {
      const stepIdx = parseInt(stepParam)
      if (!isNaN(stepIdx) && stepIdx >= 0 && stepIdx < steps.length) {
        setCurrentStep(stepIdx)
      }
    }
  }, [])

  // Auto-save: save to local storage on form changes
  const watchedValues = watch()
  useEffect(() => {
    localStorage.setItem('resume_draft', JSON.stringify(watchedValues))
  }, [watchedValues])

  const onSubmit = async (data: any) => {
    try {
      await axios.post(`http://localhost:8000/api/resumes/${user?.id || 'guest-session-id'}`, data)
      alert("Resume saved successfully!")
    } catch (err) {
      console.warn("FastAPI server offline. Draft successfully saved to browser local storage.", err)
      alert("Draft saved successfully in local browser storage!")
    }
  }

  const nextStep = () => setCurrentStep(p => Math.min(p + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 0))

  const downloadPDF = () => {
    const printContent = document.getElementById('printable-resume-preview')?.innerHTML
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert("Pop-up blocked! Please allow pop-ups to download the resume.")
      return
    }

    let styles = `
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #111827; background: #fff; line-height: 1.5; font-size: 14px; }
      h1 { font-size: 28px; font-weight: bold; margin-bottom: 5px; color: #000; text-align: center; }
      .contact-info { text-align: center; font-size: 12px; color: #4b5563; margin-bottom: 25px; }
      .section-title { font-size: 16px; font-weight: bold; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px; margin-top: 25px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
      .job-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; }
      .job-meta { display: flex; justify-content: space-between; font-size: 12px; color: #4b5563; margin-bottom: 6px; font-style: italic; }
      .job-desc { font-size: 13px; color: #374151; margin-bottom: 15px; text-align: justify; }
      .skills-list { font-size: 13px; color: #374151; }
      .summary-text { font-size: 13px; color: #374151; text-align: justify; }
    `

    if (watchedValues.template === 'tech-indigo') {
      styles += `
        .section-title { border-bottom-color: #6366f1; color: #6366f1; }
        h1 { color: #6366f1; }
      `
    } else if (watchedValues.template === 'modern-dark') {
      styles += `
        body { background: #0b0f19; color: #f3f4f6; }
        h1 { color: #fff; }
        .contact-info { color: #9ca3af; }
        .section-title { border-bottom-color: #374151; color: #8b5cf6; }
        .job-meta { color: #9ca3af; }
        .job-desc, .skills-list, .summary-text { color: #d1d5db; }
      `
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${watchedValues.personal.name || 'Resume'}_Resume</title>
          <style>${styles}</style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const downloadDOCX = () => {
    const name = watchedValues.personal.name || 'Resume'
    const personal = watchedValues.personal
    
    let resumeHtml = `
      <h1 style="text-align: center; font-family: Arial; font-size: 24pt; color: #111111; margin-bottom: 0px;">${personal.name}</h1>
      <p style="text-align: center; font-family: Arial; font-size: 10pt; color: #555555; margin-top: 5px;">
        ${personal.email} | ${personal.phone} | ${personal.location}<br>
        ${personal.linkedin} | ${personal.github} | ${personal.portfolio}
      </p>
      
      <h2 style="font-family: Arial; font-size: 14pt; border-bottom: 1.5pt solid #cccccc; padding-bottom: 3px; color: #333333; margin-top: 20px;">PROFESSIONAL SUMMARY</h2>
      <p style="font-family: Arial; font-size: 10.5pt; text-align: justify; color: #333333;">${watchedValues.summary}</p>
      
      <h2 style="font-family: Arial; font-size: 14pt; border-bottom: 1.5pt solid #cccccc; padding-bottom: 3px; color: #333333; margin-top: 20px;">EXPERIENCE</h2>
    `

    watchedValues.experience.forEach(exp => {
      resumeHtml += `
        <p style="font-family: Arial; font-size: 11pt; font-weight: bold; margin-bottom: 2px;">${exp.role} - <span style="font-weight: normal;">${exp.company}</span> <span style="float: right; font-weight: normal; font-size: 10pt;">${exp.duration}</span></p>
        <p style="font-family: Arial; font-size: 10pt; color: #333333; text-align: justify; margin-top: 2px; margin-bottom: 12px;">${exp.responsibilities}</p>
      `
    })

    resumeHtml += `<h2 style="font-family: Arial; font-size: 14pt; border-bottom: 1.5pt solid #cccccc; padding-bottom: 3px; color: #333333; margin-top: 20px;">EDUCATION</h2>`
    watchedValues.education.forEach(edu => {
      resumeHtml += `
        <p style="font-family: Arial; font-size: 11pt; font-weight: bold; margin-bottom: 2px;">${edu.degree} <span style="float: right; font-weight: normal; font-size: 10pt;">${edu.year}</span></p>
        <p style="font-family: Arial; font-size: 10pt; color: #555555; margin-top: 2px;">${edu.college} | CGPA: ${edu.cgpa}</p>
      `
    })

    if (watchedValues.projects && watchedValues.projects.length > 0) {
      resumeHtml += `<h2 style="font-family: Arial; font-size: 14pt; border-bottom: 1.5pt solid #cccccc; padding-bottom: 3px; color: #333333; margin-top: 20px;">PROJECTS</h2>`
      watchedValues.projects.forEach(proj => {
        resumeHtml += `
          <p style="font-family: Arial; font-size: 11pt; font-weight: bold; margin-bottom: 2px;">${proj.name} <span style="font-weight: normal; font-size: 9.5pt; color: #666666;">(${proj.technologies})</span></p>
          <p style="font-family: Arial; font-size: 10pt; color: #333333; text-align: justify; margin-top: 2px; margin-bottom: 8px;">${proj.description}</p>
        `
      })
    }

    if (watchedValues.certifications && watchedValues.certifications.length > 0) {
      resumeHtml += `<h2 style="font-family: Arial; font-size: 14pt; border-bottom: 1.5pt solid #cccccc; padding-bottom: 3px; color: #333333; margin-top: 20px;">CERTIFICATIONS</h2>`
      watchedValues.certifications.forEach(cert => {
        resumeHtml += `
          <p style="font-family: Arial; font-size: 10.5pt; font-weight: bold; margin-bottom: 2px;">${cert.name} <span style="font-weight: normal; float: right; font-size: 10pt;">${cert.year}</span></p>
          <p style="font-family: Arial; font-size: 10pt; color: #555555; margin-top: 2px;">${cert.issuer}</p>
        `
      })
    }

    resumeHtml += `
      <h2 style="font-family: Arial; font-size: 14pt; border-bottom: 1.5pt solid #cccccc; padding-bottom: 3px; color: #333333; margin-top: 20px;">TECHNICAL SKILLS</h2>
      <p style="font-family: Arial; font-size: 10pt; color: #333333; line-height: 1.4;">${watchedValues.skills}</p>
    `

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${name} Resume</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>90</w:Zoom>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page { size: 8.5in 11in; margin: 1in 1in 1in 1in; }
          body { font-family: Arial, sans-serif; }
        </style>
      </head>
      <body>
        ${resumeHtml}
      </body>
      </html>
    `

    const blob = new Blob([content], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name.replace(/\s+/g, '_')}_Resume.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100)

  return (
    <DashboardLayout>
      <div className="container-premium py-12 flex flex-col min-h-[calc(100vh-72px)] justify-between relative">
        
        {/* Onboarding Step Navigation Stepper Header */}
        <div className="max-w-[700px] mx-auto w-full mb-10 text-left space-y-4">
          
          {/* Progress Bar */}
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#475569]">
            <span>Onboarding Progress</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FF7A18] to-[#FF9F43] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stepper Navigation Link Titles */}
          <div className="hidden md:flex justify-between items-center pt-2 gap-2 text-xs font-bold text-[#475569]">
            {steps.map((step, idx) => {
              const isActive = currentStep === idx
              const isPast = idx < currentStep
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all ${
                    isActive 
                      ? 'border-[#F97316] text-[#0F172A]' 
                      : isPast 
                        ? 'border-[#FFB84D] text-[#475569]'
                        : 'border-transparent text-[#94A3B8] hover:text-[#475569]'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                    isActive ? 'bg-[#F97316] text-white' : 'bg-[#E2E8F0]'
                  }`}>
                    {idx + 1}
                  </span>
                  <span>{step.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Centered Onboarding Wizard Panel (Limited to 700px Form Width) */}
        <div className="max-w-[700px] mx-auto w-full card-premium p-8 flex-1 flex flex-col justify-between">
          
          {/* Step Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-[#E2E8F0] mb-8 text-left">
            <span className="p-2.5 bg-[#FF7A18]/10 text-[#F97316] rounded-2xl">
              {(() => {
                const CurIcon = steps[currentStep].icon
                return <CurIcon className="w-5 h-5" />
              })()}
            </span>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                {steps[currentStep].title} Details
              </h2>
              <p className="text-[10px] text-[#475569] font-medium">Please fill in the onboarding fields. Autosave is enabled.</p>
            </div>
          </div>

          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  
                  {/* Step 1: Personal Details */}
                  {currentStep === 0 && (
                    <div className="space-y-6 text-left">
                      <div className="floating-label-group">
                        <input id="p-name" placeholder=" " {...register('personal.name')} />
                        <label htmlFor="p-name">Full Name</label>
                        {errors.personal?.name && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.personal.name.message}</p>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="floating-label-group">
                          <input id="p-email" placeholder=" " {...register('personal.email')} />
                          <label htmlFor="p-email">Email Address</label>
                          {errors.personal?.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.personal.email.message}</p>}
                        </div>
                        <div className="floating-label-group">
                          <input id="p-phone" placeholder=" " {...register('personal.phone')} />
                          <label htmlFor="p-phone">Phone Number</label>
                        </div>
                      </div>
                      <div className="floating-label-group">
                        <input id="p-loc" placeholder=" " {...register('personal.location')} />
                        <label htmlFor="p-loc">Location (City, State)</label>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="floating-label-group">
                          <input id="p-linkedin" placeholder=" " {...register('personal.linkedin')} />
                          <label htmlFor="p-linkedin">LinkedIn URL</label>
                        </div>
                        <div className="floating-label-group">
                          <input id="p-github" placeholder=" " {...register('personal.github')} />
                          <label htmlFor="p-github">GitHub URL</label>
                        </div>
                        <div className="floating-label-group">
                          <input id="p-portfolio" placeholder=" " {...register('personal.portfolio')} />
                          <label htmlFor="p-portfolio">Portfolio URL</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Education */}
                  {currentStep === 1 && (
                    <div className="space-y-6 text-left">
                      {eduFields.map((field, index) => (
                        <div key={field.id} className="p-5 border border-[#E2E8F0] rounded-2xl bg-[#FAFAF8] relative space-y-5">
                          <button type="button" onClick={() => removeEdu(index)} className="absolute top-4 right-4 text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wide">Remove</button>
                          
                          <div className="floating-label-group">
                            <input id={`edu-college-${index}`} placeholder=" " {...register(`education.${index}.college`)} />
                            <label htmlFor={`edu-college-${index}`}>College / University</label>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="sm:col-span-2 floating-label-group">
                              <input id={`edu-degree-${index}`} placeholder=" " {...register(`education.${index}.degree`)} />
                              <label htmlFor={`edu-degree-${index}`}>Degree / Course</label>
                            </div>
                            <div className="floating-label-group">
                              <input id={`edu-cgpa-${index}`} placeholder=" " {...register(`education.${index}.cgpa`)} />
                              <label htmlFor={`edu-cgpa-${index}`}>CGPA / Grade</label>
                            </div>
                          </div>
                          
                          <div className="floating-label-group">
                            <input id={`edu-year-${index}`} placeholder=" " {...register(`education.${index}.year`)} />
                            <label htmlFor={`edu-year-${index}`}>Graduation Year Range (e.g. 2017 - 2021)</label>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => appendEdu({ college: '', degree: '', cgpa: '', year: '' })} className="w-full py-3 border-dashed border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#475569] text-xs font-semibold rounded-2xl transition-all">
                        + Add Education Row
                      </button>
                    </div>
                  )}

                  {/* Step 3: Skills Set */}
                  {currentStep === 2 && (
                    <div className="space-y-4 text-left">
                      <div className="floating-label-group">
                        <textarea id="s-skills" placeholder=" " rows={6} {...register('skills')} />
                        <label htmlFor="s-skills">Technical Skills (Comma separated)</label>
                      </div>
                      <p className="text-[10px] text-[#475569]">Provide a list of languages, software packages, or engineering workflows (e.g. React, Node.js, Python, AWS, Docker).</p>
                    </div>
                  )}

                  {/* Step 4: Projects */}
                  {currentStep === 3 && (
                    <div className="space-y-6 text-left">
                      {projFields.map((field, index) => {
                        const descLength = watchedValues.projects?.[index]?.description?.length || 0
                        return (
                          <div key={field.id} className="p-5 border border-[#E2E8F0] rounded-2xl bg-[#FAFAF8] relative space-y-5">
                            <button type="button" onClick={() => removeProj(index)} className="absolute top-4 right-4 text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wide">Remove</button>
                            
                            <div className="floating-label-group">
                              <input id={`proj-name-${index}`} placeholder=" " {...register(`projects.${index}.name`)} />
                              <label htmlFor={`proj-name-${index}`}>Project Name</label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="floating-label-group">
                                <input id={`proj-tech-${index}`} placeholder=" " {...register(`projects.${index}.technologies`)} />
                                <label htmlFor={`proj-tech-${index}`}>Technologies Used</label>
                              </div>
                              <div className="floating-label-group">
                                <input id={`proj-link-${index}`} placeholder=" " {...register(`projects.${index}.link`)} />
                                <label htmlFor={`proj-link-${index}`}>Project URL Link</label>
                              </div>
                            </div>

                            <div className="floating-label-group">
                              <textarea id={`proj-desc-${index}`} placeholder=" " rows={3} {...register(`projects.${index}.description`)} />
                              <label htmlFor={`proj-desc-${index}`}>Project Description (Max 500 chars)</label>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-[#475569]">
                              <span>Hint: Describe your impact using measurable results.</span>
                              <span className={descLength > 500 ? 'text-red-500 font-bold' : ''}>{descLength} / 500</span>
                            </div>
                            {errors.projects?.[index]?.description && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.projects[index].description.message}</p>}
                          </div>
                        )
                      })}
                      <button type="button" onClick={() => appendProj({ name: '', description: '', technologies: '', link: '' })} className="w-full py-3 border-dashed border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#475569] text-xs font-semibold rounded-2xl transition-all">
                        + Add Project Row
                      </button>
                    </div>
                  )}

                  {/* Step 5: Experience */}
                  {currentStep === 4 && (
                    <div className="space-y-6 text-left">
                      {expFields.map((field, index) => (
                        <div key={field.id} className="p-5 border border-[#E2E8F0] rounded-2xl bg-[#FAFAF8] relative space-y-5">
                          <button type="button" onClick={() => removeExp(index)} className="absolute top-4 right-4 text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wide">Remove</button>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="floating-label-group">
                              <input id={`exp-company-${index}`} placeholder=" " {...register(`experience.${index}.company`)} />
                              <label htmlFor={`exp-company-${index}`}>Company Name</label>
                            </div>
                            <div className="floating-label-group">
                              <input id={`exp-role-${index}`} placeholder=" " {...register(`experience.${index}.role`)} />
                              <label htmlFor={`exp-role-${index}`}>Job Role / Title</label>
                            </div>
                          </div>

                          <div className="floating-label-group">
                            <input id={`exp-duration-${index}`} placeholder=" " {...register(`experience.${index}.duration`)} />
                            <label htmlFor={`exp-duration-${index}`}>Duration (e.g. Jan 2022 - Present)</label>
                          </div>

                          <div className="floating-label-group">
                            <textarea id={`exp-resp-${index}`} placeholder=" " rows={3} {...register(`experience.${index}.responsibilities`)} />
                            <label htmlFor={`exp-resp-${index}`}>Responsibilities & Achievements</label>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => appendExp({ company: '', role: '', duration: '', responsibilities: '' })} className="w-full py-3 border-dashed border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#475569] text-xs font-semibold rounded-2xl transition-all">
                        + Add Experience Row
                      </button>
                    </div>
                  )}

                  {/* Step 6: Certifications */}
                  {currentStep === 5 && (
                    <div className="space-y-6 text-left">
                      {certFields.map((field, index) => (
                        <div key={field.id} className="p-5 border border-[#E2E8F0] rounded-2xl bg-[#FAFAF8] relative space-y-5">
                          <button type="button" onClick={() => removeCert(index)} className="absolute top-4 right-4 text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wide">Remove</button>
                          
                          <div className="floating-label-group">
                            <input id={`cert-name-${index}`} placeholder=" " {...register(`certifications.${index}.name`)} />
                            <label htmlFor={`cert-name-${index}`}>Certification Name</label>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="floating-label-group">
                              <input id={`cert-issuer-${index}`} placeholder=" " {...register(`certifications.${index}.issuer`)} />
                              <label htmlFor={`cert-issuer-${index}`}>Issuing Authority</label>
                            </div>
                            <div className="floating-label-group">
                              <input id={`cert-year-${index}`} placeholder=" " {...register(`certifications.${index}.year`)} />
                              <label htmlFor={`cert-year-${index}`}>Issuing Year</label>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => appendCert({ name: '', issuer: '', year: '' })} className="w-full py-3 border-dashed border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#475569] text-xs font-semibold rounded-2xl transition-all">
                        + Add Certification Row
                      </button>
                    </div>
                  )}

                  {/* Step 7: Summary */}
                  {currentStep === 6 && (
                    <div className="space-y-5 text-left">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] text-[#475569] font-bold uppercase tracking-wider block">Professional Summary</label>
                        <button 
                          type="button" 
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FF7A18]/10 text-[#F97316] border border-[#FF7A18]/20 text-[10px] font-bold"
                          onClick={() => {
                            setValue('summary', `Highly motivated software developer with expertise in ${watchedValues.skills.split(',').slice(0, 4).join(', ')}. Demonstrated experience implementing checkout flows at ${watchedValues.experience?.[0]?.company || 'leading tech companies'}.`);
                          }}
                        >
                          <Sparkles className="w-3 h-3 text-[#F97316]" /> Suggest with AI
                        </button>
                      </div>
                      <div className="floating-label-group">
                        <textarea id="s-summary" placeholder=" " rows={5} {...register('summary')} />
                        <label htmlFor="s-summary">Professional Summary (Max 600 chars)</label>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-[#475569]">
                        <span>Briefly sum up your qualifications.</span>
                        <span className={(watchedValues.summary?.length || 0) > 600 ? 'text-red-500 font-bold' : ''}>{(watchedValues.summary?.length || 0)} / 600</span>
                      </div>
                      {errors.summary && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.summary.message}</p>}
                    </div>
                  )}

                  {/* Step 8: Template Selection */}
                  {currentStep === 7 && (
                    <div className="space-y-5 text-left">
                      <label className="text-[10px] text-[#475569] font-bold uppercase tracking-wider block mb-2">Choose Visual Style</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { id: 'tech-indigo', name: 'Tech Indigo', desc: 'Modern borders with clean Indigo headings.' },
                          { id: 'modern-dark', name: 'Modern Dark', desc: 'Premium dark background layout for tech portfolios.' },
                          { id: 'minimalist-light', name: 'Minimalist Light', desc: 'Clean, elegant, high contrast print.' },
                          { id: 'classic-business', name: 'Classic Business', desc: 'Traditional corporate styling with subtle dividers.' }
                        ].map(tpl => (
                          <div 
                            key={tpl.id} 
                            onClick={() => setValue('template', tpl.id)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              watchedValues.template === tpl.id 
                                ? 'bg-[#FF7A18]/5 border-[#F97316]' 
                                : 'bg-[#FAFAF8] border-[#E2E8F0] hover:border-[#CBD5E1]'
                            }`}
                          >
                            <h3 className="font-bold text-xs text-[#0F172A]">{tpl.name}</h3>
                            <p className="text-[10px] text-[#475569] mt-1">{tpl.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </form>
          </div>

          {/* Stepper Navigation actions */}
          <div className="flex justify-between pt-6 border-t border-[#E2E8F0] mt-8">
            <button 
              type="button" 
              onClick={prevStep} 
              disabled={currentStep === 0} 
              className="btn-premium-secondary !h-11 px-5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <button
              onClick={() => setShowPreview(true)}
              className="btn-premium-secondary !h-11 px-4 text-xs font-bold border-[#FF7A18]/20 text-[#F97316] hover:bg-[#FF7A18]/5"
            >
              <Eye className="w-4 h-4 mr-1.5" /> Preview Resume
            </button>

            {currentStep < steps.length - 1 ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className="btn-premium-primary !h-11 px-5 text-sm shadow-none"
              >
                Next Step <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit(onSubmit)}
                className="btn-premium-primary !h-11 px-5 text-sm shadow-none !from-green-600 !to-emerald-500"
              >
                Finish & Save <Check className="w-4 h-4 ml-1.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right-Hand Resume Preview DRAWER Sheet (Framer Motion) */}
        <AnimatePresence>
          {showPreview && (
            <div className="fixed inset-0 z-50 flex justify-end">
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPreview(false)}
                className="absolute inset-0 bg-[#0F172A]/30 backdrop-blur-sm"
              />

              {/* Slide-over Right Drawer Container */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="relative w-full max-w-[640px] bg-white border-l border-[#E2E8F0] shadow-2xl h-full flex flex-col justify-between z-10 text-left"
              >
                {/* Drawer Header */}
                <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FAFAF8]">
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#F97316]" />
                      Live Resume Preview
                    </h3>
                    <p className="text-[10px] text-[#475569] mt-0.5">Real-time PDF compiler rendering template: <span className="font-semibold">{watchedValues.template}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={downloadPDF}
                      className="p-2 bg-[#FF7A18]/10 hover:bg-[#FF7A18]/20 border border-[#FF7A18]/25 rounded-lg text-[#F97316] transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={downloadDOCX}
                      className="p-2 bg-white hover:bg-[#FAFAF8] border border-[#E2E8F0] rounded-lg text-[#475569] hover:text-[#0F172A] transition-colors"
                      title="Export Word"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setShowPreview(false)}
                      className="p-2 hover:bg-[#FAFAF8] border border-[#E2E8F0] rounded-lg text-[#475569] hover:text-[#0F172A] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Drawer Scrollable Preview Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAF8] flex justify-center">
                  <div 
                    id="printable-resume-preview" 
                    className={`w-full max-w-2xl border p-8 rounded shadow-sm text-left font-sans transition-all duration-300 ${
                      watchedValues.template === 'tech-indigo' 
                        ? 'bg-white text-gray-900 border-indigo-400' 
                        : watchedValues.template === 'modern-dark'
                          ? 'bg-[#090d16] text-[#e2e8f0] border-violet-500/20'
                          : watchedValues.template === 'minimalist-light'
                            ? 'bg-white text-black border-gray-300'
                            : 'bg-white text-gray-900 border-gray-200'
                    }`}
                    style={{ minHeight: '680px', fontSize: '11px' }}
                  >
                    {/* Header */}
                    <div className="text-center space-y-1.5">
                      <h1 className={`text-xl font-bold tracking-tight leading-none ${
                        watchedValues.template === 'tech-indigo' ? 'text-indigo-600' : watchedValues.template === 'modern-dark' ? 'text-indigo-400' : 'text-black'
                      }`}>
                        {watchedValues.personal.name || 'Your Name'}
                      </h1>
                      <p className={`text-[9px] ${
                        watchedValues.template === 'modern-dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {[
                          watchedValues.personal.email,
                          watchedValues.personal.phone,
                          watchedValues.personal.location
                        ].filter(Boolean).join('  |  ')}
                      </p>
                      <p className="text-[8px] text-gray-400 leading-none">
                        {[
                          watchedValues.personal.linkedin,
                          watchedValues.personal.github,
                          watchedValues.personal.portfolio
                        ].filter(Boolean).join('  |  ')}
                      </p>
                    </div>

                    {/* Summary */}
                    {watchedValues.summary && (
                      <div className="mt-4 border-t pt-3">
                        <h3 className={`text-[10px] font-bold uppercase tracking-wider pb-0.5 ${
                          watchedValues.template === 'tech-indigo' 
                            ? 'text-indigo-600' 
                            : watchedValues.template === 'modern-dark'
                              ? 'text-violet-400'
                              : 'text-black'
                        }`}>
                          Summary
                        </h3>
                        <p className={`text-[9.5px] mt-1.5 text-justify leading-relaxed ${
                          watchedValues.template === 'modern-dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {watchedValues.summary}
                        </p>
                      </div>
                    )}

                    {/* Experience */}
                    {watchedValues.experience && watchedValues.experience.length > 0 && (
                      <div className="mt-4 border-t pt-3">
                        <h3 className={`text-[10px] font-bold uppercase tracking-wider pb-0.5 ${
                          watchedValues.template === 'tech-indigo' 
                            ? 'text-indigo-600' 
                            : watchedValues.template === 'modern-dark'
                              ? 'text-violet-400'
                              : 'text-black'
                        }`}>
                          Experience
                        </h3>
                        <div className="mt-2 space-y-3">
                          {watchedValues.experience.map((exp, idx) => (
                            <div key={idx} className="space-y-0.5">
                              <div className="flex justify-between font-semibold text-[9.5px]">
                                <span className={watchedValues.template === 'modern-dark' ? 'text-white' : 'text-gray-900'}>{exp.role || 'Job Role'}</span>
                                <span className={watchedValues.template === 'modern-dark' ? 'text-gray-400' : 'text-gray-500'}>{exp.duration}</span>
                              </div>
                              <p className={`text-[8.5px] italic ${watchedValues.template === 'modern-dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                {exp.company || 'Company Name'}
                              </p>
                              <p className={`text-[8.5px] text-justify leading-relaxed ${
                                watchedValues.template === 'modern-dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {exp.responsibilities}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {watchedValues.projects && watchedValues.projects.length > 0 && (
                      <div className="mt-4 border-t pt-3">
                        <h3 className={`text-[10px] font-bold uppercase tracking-wider pb-0.5 ${
                          watchedValues.template === 'tech-indigo' 
                            ? 'text-indigo-600' 
                            : watchedValues.template === 'modern-dark'
                              ? 'text-violet-400'
                              : 'text-black'
                        }`}>
                          Projects
                        </h3>
                        <div className="mt-2 space-y-2.5">
                          {watchedValues.projects.map((proj, idx) => (
                            <div key={idx} className="space-y-0.5">
                              <div className="flex justify-between font-semibold text-[9px]">
                                <span className={watchedValues.template === 'modern-dark' ? 'text-white' : 'text-gray-900'}>
                                  {proj.name || 'Project Name'} <span className="font-normal text-[8px] text-gray-500">({proj.technologies})</span>
                                </span>
                              </div>
                              <p className={`text-[8.5px] text-justify leading-relaxed ${
                                watchedValues.template === 'modern-dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {proj.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {watchedValues.education && watchedValues.education.length > 0 && (
                      <div className="mt-4 border-t pt-3">
                        <h3 className={`text-[10px] font-bold uppercase tracking-wider pb-0.5 ${
                          watchedValues.template === 'tech-indigo' 
                            ? 'text-indigo-600' 
                            : watchedValues.template === 'modern-dark'
                              ? 'text-violet-400'
                              : 'text-black'
                        }`}>
                          Education
                        </h3>
                        <div className="mt-2 space-y-2">
                          {watchedValues.education.map((edu, idx) => (
                            <div key={idx} className="flex justify-between text-[9px]">
                              <div>
                                <span className={`font-bold ${watchedValues.template === 'modern-dark' ? 'text-white' : 'text-gray-900'}`}>{edu.degree || 'Degree'}</span>
                                <p className={watchedValues.template === 'modern-dark' ? 'text-gray-400' : 'text-gray-500'}>{edu.college || 'Institution'}</p>
                              </div>
                              <div className="text-right">
                                <p className={watchedValues.template === 'modern-dark' ? 'text-gray-400' : 'text-gray-500'}>{edu.year}</p>
                                {edu.cgpa && <p className="text-[8px] text-gray-400">CGPA: {edu.cgpa}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {watchedValues.certifications && watchedValues.certifications.length > 0 && (
                      <div className="mt-4 border-t pt-3">
                        <h3 className={`text-[10px] font-bold uppercase tracking-wider pb-0.5 ${
                          watchedValues.template === 'tech-indigo' 
                            ? 'text-indigo-600' 
                            : watchedValues.template === 'modern-dark'
                              ? 'text-violet-400'
                              : 'text-black'
                        }`}>
                          Certifications
                        </h3>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-[8.5px]">
                          {watchedValues.certifications.map((cert, idx) => (
                            <div key={idx} className="flex justify-between border-b border-[#E2E8F0] pb-1">
                              <div>
                                <span className={`font-bold block ${watchedValues.template === 'modern-dark' ? 'text-white' : 'text-gray-900'}`}>{cert.name}</span>
                                <span className="text-gray-500 text-[7.5px] block">{cert.issuer}</span>
                              </div>
                              <span className="text-gray-400">{cert.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {watchedValues.skills && (
                      <div className="mt-4 border-t pt-3">
                        <h3 className={`text-[10px] font-bold uppercase tracking-wider pb-0.5 ${
                          watchedValues.template === 'tech-indigo' 
                            ? 'text-indigo-600' 
                            : watchedValues.template === 'modern-dark'
                              ? 'text-violet-400'
                              : 'text-black'
                        }`}>
                          Skills
                        </h3>
                        <p className={`text-[9px] mt-1.5 leading-relaxed ${
                          watchedValues.template === 'modern-dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {watchedValues.skills}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="p-5 border-t border-[#E2E8F0] bg-[#FAFAF8] flex gap-4">
                  <button 
                    onClick={() => setShowPreview(false)}
                    className="btn-premium-secondary w-full"
                  >
                    Close Preview
                  </button>
                  <button 
                    onClick={downloadPDF}
                    className="btn-premium-primary w-full shadow-none"
                  >
                    Export PDF
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  )
}
