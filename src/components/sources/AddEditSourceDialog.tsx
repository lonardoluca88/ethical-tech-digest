
import React from 'react';
import { NewsSource } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

interface AddEditSourceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentSource: Partial<NewsSource>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReliabilityChange: (value: number[]) => void;
  onSave: () => void;
  editMode: boolean;
}

const AddEditSourceDialog: React.FC<AddEditSourceDialogProps> = ({
  isOpen,
  onOpenChange,
  currentSource,
  onChange,
  onReliabilityChange,
  onSave,
  editMode,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editMode ? 'Modifica Fonte' : 'Aggiungi Fonte'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              value={currentSource.name || ''}
              onChange={onChange}
              placeholder="Nome della fonte"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              value={currentSource.url || ''}
              onChange={onChange}
              placeholder="https://example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reliability">
              Affidabilità: {currentSource.reliability}/10
            </Label>
            <Slider
              id="reliability"
              min={1}
              max={10}
              step={1}
              value={[currentSource.reliability || 7]}
              onValueChange={onReliabilityChange}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={onSave}>Salva</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditSourceDialog;
