import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

const STEPS = [
  { id: 'contact', title: 'Contact Info' },
  { id: 'education', title: 'Education' },
  { id: 'skills', title: 'Skills' },
  { id: 'projects', title: 'Projects' },
  { id: 'experience', title: 'Experience' }
];

export default function GuidedCreator() {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const data = useResumeStore(state => state.data);
  const updateData = useResumeStore(state => state.updateData);

  const nextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(i => i + 1);
    } else {
      navigate('/app');
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(i => i - 1);
    } else {
      navigate('/start');
    }
  };

  const currentStep = STEPS[currentStepIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b border-border/50 flex items-center justify-between px-4 sm:px-8 bg-card">
        <button onClick={prevStep} className="flex items-center text-muted-foreground hover:text-foreground text-xs sm:text-sm font-medium transition-colors shrink-0">
          <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" /> Back
        </button>
        <div className="flex gap-1 sm:gap-2 items-center">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-colors ${idx === currentStepIndex ? 'bg-primary text-primary-foreground' :
                  idx < currentStepIndex ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                }`}>
                {idx < currentStepIndex ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-4 sm:w-12 h-0.5 sm:h-1 ${idx < currentStepIndex ? 'bg-primary/50' : 'bg-secondary'}`} />
              )}
            </div>
          ))}
        </div>
        <button onClick={() => navigate('/app')} className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors shrink-0">
          Skip <span className="hidden sm:inline">to Editor</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center py-12 px-8 overflow-y-auto">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep.id === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Let's start with your details</h2>
                    <p className="text-muted-foreground">Employers need to know how to reach you.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input type="text" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={data.personalInfo.fullName} onChange={e => updateData(d => { d.personalInfo.fullName = e.target.value; })} placeholder="e.g. Jane Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email Address</label>
                      <input type="email" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={data.personalInfo.email} onChange={e => updateData(d => { d.personalInfo.email = e.target.value; })} placeholder="jane@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <input type="tel" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={data.personalInfo.phone} onChange={e => updateData(d => { d.personalInfo.phone = e.target.value; })} placeholder="+1 (555) 123-4567" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Location / City</label>
                      <input type="text" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={data.personalInfo.location} onChange={e => updateData(d => { d.personalInfo.location = e.target.value; })} placeholder="San Francisco, CA" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                      <input type="text" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={data.personalInfo.linkedin} onChange={e => updateData(d => { d.personalInfo.linkedin = e.target.value; })} placeholder="linkedin.com/in/janedoe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Website / Portfolio</label>
                      <input type="text" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={data.personalInfo.website} onChange={e => updateData(d => { d.personalInfo.website = e.target.value; })} placeholder="janedoe.com" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep.id === 'education' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Tell us about your education</h2>
                    <p className="text-muted-foreground">List your highest degree first.</p>
                  </div>

                  {data.education.length === 0 ? (
                    <button onClick={() => updateData(d => { d.education.push({ id: Date.now().toString(), school: '', degree: '', location: '', startDate: '', endDate: '', description: '' }); })} className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:border-primary transition-colors">
                      + Add Education
                    </button>
                  ) : (
                    <div className="space-y-6">
                      {data.education.map((edu, i) => (
                        <div key={edu.id} className="p-6 border border-border rounded-xl bg-card relative">
                          <button onClick={() => updateData(d => { d.education.splice(i, 1); })} className="absolute top-4 right-4 text-xs text-red-500 font-medium">Remove</button>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <label className="block text-sm font-medium mb-1">University / School</label>
                              <input type="text" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={edu.school} onChange={e => updateData(d => { d.education[i].school = e.target.value; })} placeholder="e.g. Stanford University" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Degree & Major</label>
                              <input type="text" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={edu.degree} onChange={e => updateData(d => { d.education[i].degree = e.target.value; })} placeholder="e.g. B.S. Computer Science" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Graduation Year</label>
                              <input type="text" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={edu.endDate} onChange={e => updateData(d => { d.education[i].endDate = e.target.value; })} placeholder="e.g. 2024" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => updateData(d => { d.education.push({ id: Date.now().toString(), school: '', degree: '', location: '', startDate: '', endDate: '', description: '' }); })} className="text-primary font-medium hover:underline text-sm">+ Add another education</button>
                    </div>
                  )}
                </div>
              )}

              {currentStep.id === 'skills' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">What are your top skills?</h2>
                    <p className="text-muted-foreground">List comma-separated skills (e.g. Java, Python, React, AWS).</p>
                  </div>
                  <div className="p-6 border border-border rounded-xl bg-card">
                    <textarea
                      className="w-full h-48 bg-secondary/50 border border-border rounded-lg p-4 font-mono text-sm resize-none"
                      placeholder="JavaScript, TypeScript, React, Node.js, AWS, Docker..."
                      value={data.skills.map(s => s.name).join(', ')}
                      onChange={(e) => {
                        const newSkills = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                        updateData(d => {
                          d.skills = newSkills.map((s, i) => ({ id: `skill-${i}`, name: s, category: 'Core' }));
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {currentStep.id === 'projects' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Highlight your best projects</h2>
                    <p className="text-muted-foreground">What have you built?</p>
                  </div>
                  {data.projects && data.projects.length === 0 ? (
                    <button onClick={() => updateData(d => { if (!d.projects) d.projects = []; d.projects.push({ id: Date.now().toString(), name: '', description: '', link: '' }); })} className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:border-primary transition-colors">
                      + Add Project
                    </button>
                  ) : (
                    <div className="space-y-6">
                      {data.projects?.map((proj, i) => (
                        <div key={proj.id} className="p-6 border border-border rounded-xl bg-card relative">
                          <button onClick={() => updateData(d => { d.projects!.splice(i, 1); })} className="absolute top-4 right-4 text-xs text-red-500 font-medium">Remove</button>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Project Name</label>
                              <input type="text" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={proj.name} onChange={e => updateData(d => { d.projects![i].name = e.target.value; })} placeholder="e.g. E-Commerce Platform" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Link (GitHub/Live)</label>
                              <input type="text" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={proj.link} onChange={e => updateData(d => { d.projects![i].link = e.target.value; })} placeholder="github.com/..." />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-sm font-medium mb-1">Description & Bullet Points</label>
                              <textarea className="w-full h-32 bg-secondary/50 border border-border rounded-lg p-3 resize-none" value={proj.description} onChange={e => updateData(d => { d.projects![i].description = e.target.value; })} placeholder="• Developed a full-stack platform using..." />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => updateData(d => { if (!d.projects) d.projects = []; d.projects.push({ id: Date.now().toString(), name: '', description: '', link: '' }); })} className="text-primary font-medium hover:underline text-sm">+ Add another project</button>
                    </div>
                  )}
                </div>
              )}

              {currentStep.id === 'experience' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Lastly, your work experience</h2>
                    <p className="text-muted-foreground">Add your past jobs and internships.</p>
                  </div>
                  {data.experience.length === 0 ? (
                    <button onClick={() => updateData(d => { d.experience.push({ id: Date.now().toString(), company: '', role: '', location: '', startDate: '', endDate: '', description: '' }); })} className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:border-primary transition-colors">
                      + Add Work Experience
                    </button>
                  ) : (
                    <div className="space-y-6">
                      {data.experience.map((exp, i) => (
                        <div key={exp.id} className="p-6 border border-border rounded-xl bg-card relative">
                          <button onClick={() => updateData(d => { d.experience.splice(i, 1); })} className="absolute top-4 right-4 text-xs text-red-500 font-medium">Remove</button>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Company / Organization</label>
                              <input type="text" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={exp.company} onChange={e => updateData(d => { d.experience[i].company = e.target.value; })} placeholder="e.g. Google" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Job Title</label>
                              <input type="text" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={exp.role} onChange={e => updateData(d => { d.experience[i].role = e.target.value; })} placeholder="e.g. Software Engineer" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Start Date</label>
                              <input type="text" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={exp.startDate} onChange={e => updateData(d => { d.experience[i].startDate = e.target.value; })} placeholder="e.g. Jun 2021" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">End Date</label>
                              <input type="text" className="w-full bg-secondary/50 border border-border rounded-lg p-3" value={exp.endDate} onChange={e => updateData(d => { d.experience[i].endDate = e.target.value; })} placeholder="e.g. Present" />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-sm font-medium mb-1">Achievements & Responsibilities</label>
                              <textarea className="w-full h-32 bg-secondary/50 border border-border rounded-lg p-3 resize-none" value={exp.description} onChange={e => updateData(d => { d.experience[i].description = e.target.value; })} placeholder="• Led a team of 5 engineers to..." />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => updateData(d => { d.experience.push({ id: Date.now().toString(), company: '', role: '', location: '', startDate: '', endDate: '', description: '' }); })} className="text-primary font-medium hover:underline text-sm">+ Add another experience</button>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-border flex justify-end">
                <button
                  onClick={nextStep}
                  className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg flex items-center shadow-lg hover:opacity-90 transition-opacity"
                >
                  {currentStepIndex === STEPS.length - 1 ? 'Finish & Open Editor' : 'Next Step'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
