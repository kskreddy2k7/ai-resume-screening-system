import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Plus, Trash2, ChevronDown, ChevronRight, Sparkles, LayoutTemplate, Palette } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const sectionLabels: Record<string, string> = {
  personalInfo: 'Personal Information',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  certifications: 'Certifications',
  achievements: 'Achievements',
  languages: 'Languages',
};

export default function SidebarEditor() {
  const data = useResumeStore(state => state.data);
  const updateData = useResumeStore(state => state.updateData);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    personalInfo: true, // Expand Personal Info by default
  });

  const toggleCollapse = (id: string) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(data.sectionOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateData(draft => {
      draft.sectionOrder = items;
    });
  };

  const inputStyles = "w-full bg-[#141414] border border-[#222] focus:border-primary/50 text-white rounded-lg p-2.5 text-xs transition-all focus:outline-none placeholder:text-muted-foreground/30 focus:ring-1 focus:ring-primary/10";
  const labelStyles = "block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1";

  const renderSectionForm = (sectionId: string) => {
    switch (sectionId) {
      case 'personalInfo':
        return (
          <div className="space-y-3 px-4 pb-4 border-t border-white/5 pt-3">
            <div>
              <label className={labelStyles}>Full Name</label>
              <input type="text" className={inputStyles} value={data.personalInfo.fullName || ''} onChange={e => updateData(d => { d.personalInfo.fullName = e.target.value; })} placeholder="John Doe" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelStyles}>Email</label>
                <input type="email" className={inputStyles} value={data.personalInfo.email || ''} onChange={e => updateData(d => { d.personalInfo.email = e.target.value; })} placeholder="john@example.com" />
              </div>
              <div>
                <label className={labelStyles}>Phone</label>
                <input type="tel" className={inputStyles} value={data.personalInfo.phone || ''} onChange={e => updateData(d => { d.personalInfo.phone = e.target.value; })} placeholder="+1 (555) 019-2834" />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Location</label>
              <input type="text" className={inputStyles} value={data.personalInfo.location || ''} onChange={e => updateData(d => { d.personalInfo.location = e.target.value; })} placeholder="San Francisco, CA" />
            </div>
            <div>
              <label className={labelStyles}>LinkedIn</label>
              <input type="text" className={inputStyles} value={data.personalInfo.linkedin || ''} onChange={e => updateData(d => { d.personalInfo.linkedin = e.target.value; })} placeholder="linkedin.com/in/johndoe" />
            </div>
            <div>
              <label className={labelStyles}>Website / Portfolio</label>
              <input type="text" className={inputStyles} value={data.personalInfo.website || ''} onChange={e => updateData(d => { d.personalInfo.website = e.target.value; })} placeholder="johndoe.dev" />
            </div>
          </div>
        );
      case 'summary':
        return (
          <div className="px-4 pb-4 border-t border-white/5 pt-3">
            <label className={labelStyles}>Professional Summary</label>
            <textarea 
              className={`${inputStyles} h-32 resize-none leading-relaxed`}
              value={data.summary || ''} 
              onChange={e => updateData(d => { d.summary = e.target.value; })}
              placeholder="Write a brief, high-impact professional summary. Highlight your years of experience, core expertise, and key achievements..."
            />
          </div>
        );
      case 'experience':
        return (
          <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-4">
            {data.experience.map((exp, i) => (
              <div key={exp.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl relative group/card hover:border-white/10 transition-all">
                <button 
                  onClick={() => updateData(d => { d.experience.splice(i, 1); })} 
                  className="absolute top-3 right-3 text-muted-foreground hover:text-red-400 p-1 rounded-md hover:bg-white/5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="space-y-2.5 mt-1">
                  <div>
                    <label className={labelStyles}>Company</label>
                    <input type="text" className={inputStyles} value={exp.company || ''} onChange={e => updateData(d => { d.experience[i].company = e.target.value; })} placeholder="Google" />
                  </div>
                  <div>
                    <label className={labelStyles}>Job Title</label>
                    <input type="text" className={inputStyles} value={exp.role || ''} onChange={e => updateData(d => { d.experience[i].role = e.target.value; })} placeholder="Senior Software Engineer" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelStyles}>Start Date</label>
                      <input type="text" className={inputStyles} value={exp.startDate || ''} onChange={e => updateData(d => { d.experience[i].startDate = e.target.value; })} placeholder="Jan 2021" />
                    </div>
                    <div>
                      <label className={labelStyles}>End Date</label>
                      <input type="text" className={inputStyles} value={exp.endDate || ''} onChange={e => updateData(d => { d.experience[i].endDate = e.target.value; })} placeholder="Present" />
                    </div>
                  </div>
                  <div>
                    <label className={labelStyles}>Location</label>
                    <input type="text" className={inputStyles} value={exp.location || ''} onChange={e => updateData(d => { d.experience[i].location = e.target.value; })} placeholder="Mountain View, CA" />
                  </div>
                  <div>
                    <label className={labelStyles}>Description & Achievements</label>
                    <textarea 
                      className={`${inputStyles} h-28 resize-none leading-relaxed`} 
                      value={exp.description || ''} 
                      onChange={e => updateData(d => { d.experience[i].description = e.target.value; })} 
                      placeholder="• Spearheaded design and development of X, leading to Y% improvement.&#10;• Collaborated with team of Z to ship major update."
                    />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => updateData(d => { d.experience.push({ id: uuidv4(), company: '', role: '', location: '', startDate: '', endDate: '', description: '' }); })} 
              className="w-full py-2.5 border border-dashed border-white/10 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white hover:border-white/20 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Experience
            </button>
          </div>
        );
      case 'education':
        return (
          <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-4">
            {data.education.map((edu, i) => (
              <div key={edu.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl relative group/card hover:border-white/10 transition-all">
                <button 
                  onClick={() => updateData(d => { d.education.splice(i, 1); })} 
                  className="absolute top-3 right-3 text-muted-foreground hover:text-red-400 p-1 rounded-md hover:bg-white/5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="space-y-2.5 mt-1">
                  <div>
                    <label className={labelStyles}>School/University</label>
                    <input type="text" className={inputStyles} value={edu.school || ''} onChange={e => updateData(d => { d.education[i].school = e.target.value; })} placeholder="Stanford University" />
                  </div>
                  <div>
                    <label className={labelStyles}>Degree & Major</label>
                    <input type="text" className={inputStyles} value={edu.degree || ''} onChange={e => updateData(d => { d.education[i].degree = e.target.value; })} placeholder="B.S. in Computer Science" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelStyles}>Start Date</label>
                      <input type="text" className={inputStyles} value={edu.startDate || ''} onChange={e => updateData(d => { d.education[i].startDate = e.target.value; })} placeholder="Sep 2016" />
                    </div>
                    <div>
                      <label className={labelStyles}>End Date</label>
                      <input type="text" className={inputStyles} value={edu.endDate || ''} onChange={e => updateData(d => { d.education[i].endDate = e.target.value; })} placeholder="Jun 2020" />
                    </div>
                  </div>
                  <div>
                    <label className={labelStyles}>Location</label>
                    <input type="text" className={inputStyles} value={edu.location || ''} onChange={e => updateData(d => { d.education[i].location = e.target.value; })} placeholder="Stanford, CA" />
                  </div>
                  <div>
                    <label className={labelStyles}>Description</label>
                    <textarea 
                      className={`${inputStyles} h-20 resize-none leading-relaxed`} 
                      value={edu.description || ''} 
                      onChange={e => updateData(d => { d.education[i].description = e.target.value; })} 
                      placeholder="• GPA: 3.9/4.0. Relevant coursework: Distributed Systems, Algorithms."
                    />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => updateData(d => { d.education.push({ id: uuidv4(), school: '', degree: '', location: '', startDate: '', endDate: '', description: '' }); })} 
              className="w-full py-2.5 border border-dashed border-white/10 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white hover:border-white/20 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Education
            </button>
          </div>
        );
      case 'projects':
        return (
          <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-4">
            {data.projects?.map((proj, i) => (
              <div key={proj.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl relative group/card hover:border-white/10 transition-all">
                <button 
                  onClick={() => updateData(d => { d.projects!.splice(i, 1); })} 
                  className="absolute top-3 right-3 text-muted-foreground hover:text-red-400 p-1 rounded-md hover:bg-white/5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="space-y-2.5 mt-1">
                  <div>
                    <label className={labelStyles}>Project Name</label>
                    <input type="text" className={inputStyles} value={proj.name || ''} onChange={e => updateData(d => { d.projects![i].name = e.target.value; })} placeholder="TalentFlow Resume Builder" />
                  </div>
                  <div>
                    <label className={labelStyles}>Link URL</label>
                    <input type="text" className={inputStyles} value={proj.link || ''} onChange={e => updateData(d => { d.projects![i].link = e.target.value; })} placeholder="github.com/username/project" />
                  </div>
                  <div>
                    <label className={labelStyles}>Description</label>
                    <textarea 
                      className={`${inputStyles} h-24 resize-none leading-relaxed`} 
                      value={proj.description || ''} 
                      onChange={e => updateData(d => { d.projects![i].description = e.target.value; })} 
                      placeholder="• Built React resume builder featuring real-time preview and ATS score analyzer.&#10;• Designed sleek CSS layout system that ensures 1-page constraints."
                    />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => updateData(d => { if(!d.projects) d.projects = []; d.projects.push({ id: uuidv4(), name: '', description: '', link: '' }); })} 
              className="w-full py-2.5 border border-dashed border-white/10 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white hover:border-white/20 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>
        );
      case 'skills':
        return (
          <div className="px-4 pb-4 border-t border-white/5 pt-3">
            <label className={labelStyles}>Skills (Comma separated)</label>
            <textarea 
              className={`${inputStyles} h-28 resize-none leading-relaxed`} 
              placeholder="React, TypeScript, Node.js, Python, SQL, Docker, AWS..."
              value={data.skills.map(s => s.name).join(', ')}
              onChange={(e) => {
                const newSkills = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                updateData(d => {
                  d.skills = newSkills.map((s, i) => ({ id: `skill-${i}`, name: s, category: 'Core' }));
                });
              }}
            />
          </div>
        );
      case 'certifications':
        return (
          <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-4">
            {data.certifications?.map((cert, i) => (
              <div key={cert.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl relative group/card hover:border-white/10 transition-all">
                <button 
                  onClick={() => updateData(d => { d.certifications.splice(i, 1); })} 
                  className="absolute top-3 right-3 text-muted-foreground hover:text-red-400 p-1 rounded-md hover:bg-white/5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="space-y-2.5 mt-1">
                  <div>
                    <label className={labelStyles}>Certification Name</label>
                    <input type="text" className={inputStyles} value={cert.name || ''} onChange={e => updateData(d => { d.certifications[i].name = e.target.value; })} placeholder="AWS Certified Solutions Architect" />
                  </div>
                  <div>
                    <label className={labelStyles}>Issuer</label>
                    <input type="text" className={inputStyles} value={cert.issuer || ''} onChange={e => updateData(d => { d.certifications[i].issuer = e.target.value; })} placeholder="Amazon Web Services" />
                  </div>
                  <div>
                    <label className={labelStyles}>Date</label>
                    <input type="text" className={inputStyles} value={cert.date || ''} onChange={e => updateData(d => { d.certifications[i].date = e.target.value; })} placeholder="2024" />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => updateData(d => { if(!d.certifications) d.certifications = []; d.certifications.push({ id: uuidv4(), name: '', issuer: '', date: '' }); })} 
              className="w-full py-2.5 border border-dashed border-white/10 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white hover:border-white/20 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Certification
            </button>
          </div>
        );
      case 'achievements':
        return (
          <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-4">
            {data.achievements?.map((ach, i) => (
              <div key={ach.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl relative group/card hover:border-white/10 transition-all">
                <button 
                  onClick={() => updateData(d => { d.achievements.splice(i, 1); })} 
                  className="absolute top-3 right-3 text-muted-foreground hover:text-red-400 p-1 rounded-md hover:bg-white/5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="space-y-2.5 mt-1">
                  <div>
                    <label className={labelStyles}>Achievement Title</label>
                    <input type="text" className={inputStyles} value={ach.name || ''} onChange={e => updateData(d => { d.achievements[i].name = e.target.value; })} placeholder="1st Place at TechCrunch Disrupt Hackathon" />
                  </div>
                  <div>
                    <label className={labelStyles}>Date</label>
                    <input type="text" className={inputStyles} value={ach.date || ''} onChange={e => updateData(d => { d.achievements[i].date = e.target.value; })} placeholder="2023" />
                  </div>
                  <div>
                    <label className={labelStyles}>Description</label>
                    <textarea 
                      className={`${inputStyles} h-16 resize-none leading-relaxed`} 
                      value={ach.description || ''} 
                      onChange={e => updateData(d => { d.achievements[i].description = e.target.value; })} 
                      placeholder="Briefly describe the achievement and its impact."
                    />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => updateData(d => { if(!d.achievements) d.achievements = []; d.achievements.push({ id: uuidv4(), name: '', date: '', description: '' }); })} 
              className="w-full py-2.5 border border-dashed border-white/10 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white hover:border-white/20 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Achievement
            </button>
          </div>
        );
      case 'languages':
        return (
          <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-4">
            {data.languages?.map((lang, i) => (
              <div key={lang.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl relative group/card hover:border-white/10 transition-all">
                <button 
                  onClick={() => updateData(d => { d.languages.splice(i, 1); })} 
                  className="absolute top-3 right-3 text-muted-foreground hover:text-red-400 p-1 rounded-md hover:bg-white/5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="space-y-2.5 mt-1">
                  <div>
                    <label className={labelStyles}>Language</label>
                    <input type="text" className={inputStyles} value={lang.name || ''} onChange={e => updateData(d => { d.languages[i].name = e.target.value; })} placeholder="English" />
                  </div>
                  <div>
                    <label className={labelStyles}>Proficiency</label>
                    <input type="text" className={inputStyles} value={lang.proficiency || ''} onChange={e => updateData(d => { d.languages[i].proficiency = e.target.value; })} placeholder="Native / Full Professional" />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => updateData(d => { if(!d.languages) d.languages = []; d.languages.push({ id: uuidv4(), name: '', proficiency: '' }); })} 
              className="w-full py-2.5 border border-dashed border-white/10 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white hover:border-white/20 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Language
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const templateId = useResumeStore(state => state.templateId);
  const setTemplateId = useResumeStore(state => state.setTemplateId);
  const activeColor = useResumeStore((state: any) => state.data.layout?.primaryColor || '#0a0a0a');

  return (
    <div className="w-full lg:w-80 flex flex-col border-r border-border/50 bg-[#060606] overflow-hidden shrink-0">
      <div className="h-14 flex items-center px-6 border-b border-border/30 font-display font-bold tracking-tight text-white/90 text-sm gap-2">
        <Sparkles className="w-4 h-4 text-primary" /> Resume Editor
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
        {/* Template & Color Selector Card */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 space-y-3">
          <span className="text-[10px] font-bold tracking-wide uppercase text-white/50 block">Design & Layout</span>
          
          <div className="grid grid-cols-2 gap-2">
            {/* Template Selector */}
            <div className="relative">
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="w-full appearance-none bg-[#141414] border border-[#222] text-xs text-white/90 rounded-lg pl-8 pr-6 py-2 focus:outline-none focus:border-primary/50 cursor-pointer hover:bg-white/[0.02]"
              >
                <option value="professional">Corporate</option>
                <option value="modern">Modern Tech</option>
                <option value="executive">Executive</option>
                <option value="minimal">Clean Min</option>
              </select>
              <LayoutTemplate className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Color Swatch Selector */}
            <div className="relative flex items-center bg-[#141414] border border-[#222] rounded-lg px-2.5 py-2 hover:bg-white/[0.02] cursor-pointer">
              <Palette className="w-3.5 h-3.5 text-muted-foreground mr-1.5 shrink-0" />
              <span className="text-[10px] text-white/85 font-medium mr-1.5 truncate">Theme Color</span>
              <div
                className="w-4 h-4 rounded-full border border-white/10 relative overflow-hidden shrink-0 shadow-sm ml-auto"
                style={{ backgroundColor: activeColor }}
              >
                <input
                  type="color"
                  value={activeColor}
                  onChange={(e) => updateData((d: any) => { if (!d.layout) d.layout = {}; d.layout.primaryColor = e.target.value; })}
                  className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                />
              </div>
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {data.sectionOrder.map((sectionId, index) => {
                  if (!sectionLabels[sectionId]) return null;
                  const isCollapsed = !collapsed[sectionId];
                  
                  return (
                    <Draggable key={sectionId} draggableId={sectionId} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden transition-all duration-200 ${
                            snapshot.isDragging 
                              ? 'ring-1 ring-primary/30 border-white/10 bg-white/[0.06] shadow-xl shadow-black/80' 
                              : 'hover:border-white/10 hover:bg-white/[0.03]'
                          }`}
                        >
                          <div className="flex items-center p-3.5 group cursor-pointer select-none">
                            <div {...provided.dragHandleProps} className="p-1 -ml-1 mr-2 cursor-grab active:cursor-grabbing text-muted-foreground/35 hover:text-white transition-colors">
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>
                            <span 
                              className="flex-1 text-xs font-bold tracking-wide uppercase text-white/80 group-hover:text-white transition-colors"
                              onClick={() => toggleCollapse(sectionId)}
                            >
                              {sectionLabels[sectionId]}
                            </span>
                            <button 
                              onClick={() => toggleCollapse(sectionId)}
                              className="p-1 rounded hover:bg-white/5 text-muted-foreground/50 hover:text-white transition-all"
                            >
                              {!isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          </div>
                          
                          {!isCollapsed && renderSectionForm(sectionId)}
                        </div>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
