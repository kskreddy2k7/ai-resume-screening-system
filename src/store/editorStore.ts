import { create } from 'zustand';

export type BlockType = 'text' | 'experience' | 'education' | 'skills';

export interface BlockData {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  w: number;
  h: number;
  content: any;
}

interface EditorState {
  blocks: BlockData[];
  selectedBlockId: string | null;
  zoom: number;
  addBlock: (block: Omit<BlockData, 'id'>) => void;
  updateBlock: (id: string, updates: Partial<BlockData>) => void;
  setSelectedBlockId: (id: string | null) => void;
  setZoom: (zoom: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  blocks: [
    {
      id: '1',
      type: 'text',
      x: 40,
      y: 40,
      w: 400,
      h: 80,
      content: { text: 'ALEXANDER WRIGHT\nProduct Manager', style: 'header' }
    },
    {
      id: '2',
      type: 'experience',
      x: 40,
      y: 150,
      w: 400,
      h: 200,
      content: { role: 'Senior PM', company: 'Google', dates: '2020 - Present' }
    }
  ],
  selectedBlockId: null,
  zoom: 1,
  addBlock: (block) => set((state) => ({ 
    blocks: [...state.blocks, { ...block, id: Math.random().toString(36).substr(2, 9) }] 
  })),
  updateBlock: (id, updates) => set((state) => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
  })),
  setSelectedBlockId: (id) => set({ selectedBlockId: id }),
  setZoom: (zoom) => set({ zoom }),
}));
