import { useResumeStore } from '../../store/resumeStore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Plus, Trash2, ChevronDown, ChevronRight, Eye } from 'lucide-react';
import { useState } from 'react';

const sectionLabels: Record<string, string> = {
  personalInfo: 'Personal Information',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
};

export default function DocumentStructure() {
  const data = useResumeStore(state => state.data);
  const updateData = useResumeStore(state => state.updateData);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

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

  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Document Structure</h2>
        <button className="p-1 hover:bg-white/5 rounded text-muted-foreground hover:text-white transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {data.sectionOrder.map((sectionId, index) => (
                <Draggable key={sectionId} draggableId={sectionId} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-white/5 border border-white/5 rounded-lg overflow-hidden transition-colors ${
                        snapshot.isDragging ? 'ring-1 ring-primary/50 bg-white/10' : 'hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center p-2 group">
                        <div {...provided.dragHandleProps} className="p-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-white transition-colors">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <button 
                          onClick={() => toggleCollapse(sectionId)}
                          className="p-1 text-muted-foreground hover:text-white transition-colors mr-2"
                        >
                          {collapsed[sectionId] ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <span className="flex-1 text-sm font-medium">{sectionLabels[sectionId] || sectionId}</span>
                        
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-muted-foreground hover:text-white hover:bg-white/10 rounded transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      {!collapsed[sectionId] && (
                        <div className="px-4 pb-3 pl-10 text-xs text-muted-foreground">
                          {/* Inner contents placeholder */}
                          {sectionId === 'experience' && `${data.experience.length} items`}
                          {sectionId === 'education' && `${data.education.length} items`}
                          {sectionId === 'projects' && `${data.projects.length} items`}
                          {sectionId === 'skills' && `${data.skills.length} categories`}
                          {(sectionId === 'summary' || sectionId === 'personalInfo') && 'Edit on canvas'}
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
