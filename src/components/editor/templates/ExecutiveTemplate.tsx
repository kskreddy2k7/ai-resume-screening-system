import { useResumeStore } from '../../../store/resumeStore';
import EditableField from '../EditableField';

export default function ExecutiveTemplate() {
  const data = useResumeStore(state => state.data);
  const updateData = useResumeStore(state => state.updateData);
  const layout = data.layout || { fontFamily: 'Garamond, serif', fontSize: 14, primaryColor: '#0f172a', lineSpacing: 1.5, margins: 20 };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'personalInfo':
        return (
          <div className="text-center mb-6" key="personalInfo">
            <h1 className="text-3xl font-bold uppercase tracking-wide mb-2 text-black">
              <EditableField value={data.personalInfo.fullName} onChange={v => updateData(d => { d.personalInfo.fullName = v; })} placeholder="FIRSTNAME LASTNAME" />
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-x-2 text-[13px] text-gray-800">
              {data.personalInfo.email && <EditableField value={data.personalInfo.email} onChange={v => updateData(d => { d.personalInfo.email = v; })} placeholder="Email" />}
              {data.personalInfo.phone && <><span className="mx-1">|</span><EditableField value={data.personalInfo.phone} onChange={v => updateData(d => { d.personalInfo.phone = v; })} placeholder="Phone" /></>}
              {data.personalInfo.location && <><span className="mx-1">|</span><EditableField value={data.personalInfo.location} onChange={v => updateData(d => { d.personalInfo.location = v; })} placeholder="Location" /></>}
              {data.personalInfo.linkedin && <><span className="mx-1">|</span><EditableField value={data.personalInfo.linkedin} onChange={v => updateData(d => { d.personalInfo.linkedin = v; })} placeholder="LinkedIn" /></>}
              {data.personalInfo.website && <><span className="mx-1">|</span><EditableField value={data.personalInfo.website} onChange={v => updateData(d => { d.personalInfo.website = v; })} placeholder="Website" /></>}
            </div>
          </div>
        );

      case 'summary':
        if (!data.summary) return null;
        return (
          <div className="mb-5" key="summary">
            <h2 className="text-sm font-bold uppercase border-b-[1.5px] border-black pb-1 mb-2 text-black tracking-wider">Professional Summary</h2>
            <div className="text-[13px] text-gray-900 leading-relaxed text-justify">
              <EditableField value={data.summary} onChange={v => updateData(d => { d.summary = v; })} multiline placeholder="Enter your professional summary here..." />
            </div>
          </div>
        );

      case 'experience':
        if (data.experience.length === 0) return null;
        return (
          <div className="mb-5" key="experience">
            <h2 className="text-sm font-bold uppercase border-b-[1.5px] border-black pb-1 mb-3 text-black tracking-wider">Experience</h2>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="text-[14px] font-bold text-black">
                      <EditableField value={exp.company} onChange={v => updateData(d => { d.experience[i].company = v; })} placeholder="Company Name" />
                    </div>
                    <div className="text-[13px] text-black font-semibold">
                      <EditableField value={exp.location} onChange={v => updateData(d => { d.experience[i].location = v; })} placeholder="City, State" />
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="text-[13px] italic text-black font-medium">
                      <EditableField value={exp.role} onChange={v => updateData(d => { d.experience[i].role = v; })} placeholder="Job Title" />
                    </div>
                    <div className="text-[13px] text-black">
                      <EditableField value={exp.startDate} onChange={v => updateData(d => { d.experience[i].startDate = v; })} placeholder="Start Date" />
                      <span className="mx-1">-</span>
                      <EditableField value={exp.endDate} onChange={v => updateData(d => { d.experience[i].endDate = v; })} placeholder="End Date" />
                    </div>
                  </div>
                  <div className="text-[13px] text-gray-900 leading-relaxed ml-4">
                    <EditableField value={exp.description} onChange={v => updateData(d => { d.experience[i].description = v; })} multiline placeholder="• Enter your achievements and responsibilities here..." />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (data.education.length === 0) return null;
        return (
          <div className="mb-5" key="education">
            <h2 className="text-sm font-bold uppercase border-b-[1.5px] border-black pb-1 mb-3 text-black tracking-wider">Education</h2>
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="text-[14px] font-bold text-black">
                      <EditableField value={edu.school} onChange={v => updateData(d => { d.education[i].school = v; })} placeholder="University Name" />
                    </div>
                    <div className="text-[13px] text-black font-semibold">
                      <EditableField value={edu.location} onChange={v => updateData(d => { d.education[i].location = v; })} placeholder="City, State" />
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="text-[13px] italic text-black font-medium">
                      <EditableField value={edu.degree} onChange={v => updateData(d => { d.education[i].degree = v; })} placeholder="Degree and Major" />
                    </div>
                    <div className="text-[13px] text-black">
                      <EditableField value={edu.startDate} onChange={v => updateData(d => { d.education[i].startDate = v; })} placeholder="Start Date" />
                      <span className="mx-1">-</span>
                      <EditableField value={edu.endDate} onChange={v => updateData(d => { d.education[i].endDate = v; })} placeholder="End Date" />
                    </div>
                  </div>
                  {edu.description && (
                    <div className="text-[13px] text-gray-900 ml-4 leading-relaxed">
                      <EditableField value={edu.description} onChange={v => updateData(d => { d.education[i].description = v; })} multiline />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (data.skills.length === 0) return null;
        return (
          <div className="mb-5" key="skills">
            <h2 className="text-sm font-bold uppercase border-b-[1.5px] border-black pb-1 mb-2 text-black tracking-wider">Skills & Interests</h2>
            <div className="text-[13px] text-gray-900 leading-relaxed flex flex-wrap gap-x-2">
              <span className="font-bold">Core Competencies:</span>
              {data.skills.map((skill, i) => (
                <span key={skill.id} className="inline-flex">
                  <EditableField value={skill.name} onChange={v => updateData(d => { d.skills[i].name = v; })} placeholder="Skill" />
                  {i < data.skills.length - 1 ? <span className="mr-1">,</span> : null}
                </span>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (!data.projects || data.projects.length === 0) return null;
        return (
          <div className="mb-5" key="projects">
            <h2 className="text-sm font-bold uppercase border-b-[1.5px] border-black pb-1 mb-3 text-black tracking-wider">Projects</h2>
            <div className="space-y-4">
              {data.projects.map((proj, i) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="text-[14px] font-bold text-black flex items-center gap-2">
                      <EditableField value={proj.name} onChange={v => updateData(d => { d.projects[i].name = v; })} placeholder="Project Name" />
                      {proj.link && (
                        <span className="font-normal italic text-[12px] text-blue-600 hover:underline">
                          <EditableField value={proj.link} onChange={v => updateData(d => { d.projects[i].link = v; })} placeholder="github.com/link" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[13px] text-gray-900 leading-relaxed ml-4">
                    <EditableField value={proj.description} onChange={v => updateData(d => { d.projects[i].description = v; })} multiline placeholder="• Project details..." />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (!data.certifications || data.certifications.length === 0) return null;
        return (
          <div className="mb-5" key="certifications">
            <h2 className="text-sm font-bold uppercase border-b-[1.5px] border-black pb-1 mb-2.5 text-black tracking-wider">Certifications</h2>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={cert.id} className="flex justify-between items-baseline text-[13px]">
                  <div className="text-black">
                    <span className="font-bold"><EditableField value={cert.name} onChange={v => updateData(d => { d.certifications[i].name = v; })} placeholder="Certification Name" /></span>
                    {cert.issuer && (
                      <>
                        <span className="text-gray-400 mx-1.5">|</span>
                        <span className="text-gray-800"><EditableField value={cert.issuer} onChange={v => updateData(d => { d.certifications[i].issuer = v; })} placeholder="Issuer" /></span>
                      </>
                    )}
                  </div>
                  <div className="text-black">
                    <EditableField value={cert.date} onChange={v => updateData(d => { d.certifications[i].date = v; })} placeholder="Date" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        if (!data.achievements || data.achievements.length === 0) return null;
        return (
          <div className="mb-5" key="achievements">
            <h2 className="text-sm font-bold uppercase border-b-[1.5px] border-black pb-1 mb-2.5 text-black tracking-wider">Achievements</h2>
            <div className="space-y-2.5">
              {data.achievements.map((ach, i) => (
                <div key={ach.id} className="text-[13px]">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="font-bold text-black">
                      <EditableField value={ach.name} onChange={v => updateData(d => { d.achievements[i].name = v; })} placeholder="Achievement Title" />
                    </div>
                    <div className="text-black">
                      <EditableField value={ach.date} onChange={v => updateData(d => { d.achievements[i].date = v; })} placeholder="Date" />
                    </div>
                  </div>
                  {ach.description && (
                    <div className="text-gray-900 leading-relaxed ml-4 text-[12px]">
                      <EditableField value={ach.description} onChange={v => updateData(d => { d.achievements[i].description = v; })} multiline placeholder="Describe achievement..." />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'languages':
        if (!data.languages || data.languages.length === 0) return null;
        return (
          <div className="mb-5" key="languages">
            <h2 className="text-sm font-bold uppercase border-b-[1.5px] border-black pb-1 mb-2 text-black tracking-wider">Languages</h2>
            <div className="text-[13px] text-gray-900 leading-relaxed flex flex-wrap gap-x-4">
              {data.languages.map((lang, i) => (
                <span key={lang.id} className="inline-flex items-center">
                  <span className="font-bold text-black"><EditableField value={lang.name} onChange={v => updateData(d => { d.languages[i].name = v; })} placeholder="Language" /></span>
                  {lang.proficiency && (
                    <span className="text-gray-600 italic ml-1">({lang.proficiency})</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="text-black bg-white" style={{ fontFamily: layout.fontFamily || 'Garamond, serif', padding: `${layout.margins || 20}mm` }}>
      {data.sectionOrder.map(renderSection)}
    </div>
  );
}
