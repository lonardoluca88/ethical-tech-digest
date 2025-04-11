
import React, { useState } from 'react';
import { NewsItem, NewsCategory, NewsSource } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AdminNewsFormProps {
  onSave: (newsItem: NewsItem) => void;
  onCancel: () => void;
  initialData?: NewsItem;
  sources: NewsSource[];
}

const AdminNewsForm: React.FC<AdminNewsFormProps> = ({ 
  onSave, 
  onCancel, 
  initialData,
  sources
}) => {
  const [formData, setFormData] = useState<Partial<NewsItem>>(
    initialData || {
      title: '',
      url: '',
      date: new Date().toISOString().split('T')[0],
      sourceId: sources[0]?.id || '',
      category: 'ai' as NewsCategory,
      summary: ''
    }
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.url || !formData.sourceId || !formData.category) {
      toast.error('Per favore completa tutti i campi obbligatori');
      return;
    }
    
    // Create or update news item
    const newsItem: NewsItem = {
      id: initialData?.id || crypto.randomUUID(),
      title: formData.title!,
      url: formData.url!,
      date: formData.date!,
      sourceId: formData.sourceId!,
      category: formData.category as NewsCategory,
      summary: formData.summary,
    };
    
    onSave(newsItem);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Modifica Notizia' : 'Aggiungi Nuova Notizia'}
      </h2>
      
      <div className="space-y-2">
        <Label htmlFor="title">Titolo *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="url">URL *</Label>
        <Input
          id="url"
          name="url"
          type="url"
          value={formData.url || ''}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Data *</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date || ''}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sourceId">Fonte *</Label>
        <Select 
          name="sourceId" 
          value={formData.sourceId} 
          onValueChange={(value) => handleSelectChange('sourceId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona una fonte" />
          </SelectTrigger>
          <SelectContent>
            {sources.map(source => (
              <SelectItem key={source.id} value={source.id}>
                {source.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Categoria *</Label>
        <Select 
          name="category" 
          value={formData.category} 
          onValueChange={(value) => handleSelectChange('category', value as NewsCategory)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona una categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ai">Intelligenza Artificiale</SelectItem>
            <SelectItem value="robotics">Robotica</SelectItem>
            <SelectItem value="biotech">Biotecnologia</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="summary">Sommario</Label>
        <Textarea
          id="summary"
          name="summary"
          value={formData.summary || ''}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annulla
        </Button>
        <Button type="submit">
          {initialData ? 'Aggiorna' : 'Aggiungi'}
        </Button>
      </div>
    </form>
  );
};

export default AdminNewsForm;
