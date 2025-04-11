
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { NewsItem, NewsSource, AppSettings } from '@/lib/types';
import { dummyNews, dummySources, defaultAppSettings } from '@/lib/dummyData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, FileText, PaintBucket, Mail, HelpCircle } from 'lucide-react';
import AdminNewsForm from '@/components/AdminNewsForm';
import SourcesManager from '@/components/SourcesManager';
import StylesCustomizer from '@/components/StylesCustomizer';
import EmailSettings from '@/components/EmailSettings';
import InstallationGuide from '@/components/InstallationGuide';
import { toast } from 'sonner';
import { CategoryIcon, getCategoryName } from '@/components/icons/CategoryIcons';

const Admin = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentNewsItem, setCurrentNewsItem] = useState<NewsItem | undefined>();
  const [activeTab, setActiveTab] = useState("news");
  
  useEffect(() => {
    // Simulate loading data from storage/API
    setNews(dummyNews);
    setSources(dummySources);
  }, []);
  
  const handleEditNews = (newsItem: NewsItem) => {
    setCurrentNewsItem(newsItem);
    setIsDialogOpen(true);
  };
  
  const handleAddNews = () => {
    setCurrentNewsItem(undefined);
    setIsDialogOpen(true);
  };
  
  const handleDeleteNews = (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa notizia?')) {
      setNews(news.filter(item => item.id !== id));
      toast.success('Notizia eliminata con successo');
    }
  };
  
  const handleSaveNews = (newsItem: NewsItem) => {
    if (currentNewsItem) {
      // Update existing news
      setNews(news.map(item => item.id === newsItem.id ? newsItem : item));
      toast.success('Notizia aggiornata con successo');
    } else {
      // Add new news
      setNews([...news, newsItem]);
      toast.success('Notizia aggiunta con successo');
    }
    setIsDialogOpen(false);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  const handleUpdateSources = (updatedSources: NewsSource[]) => {
    setSources(updatedSources);
  };
  
  const handleUpdateSettings = (updatedSettings: AppSettings) => {
    setSettings(updatedSettings);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold mb-2">
            Pannello di Amministrazione
          </h1>
          <p className="text-muted-foreground">
            Gestisci le notizie, le fonti e le impostazioni del widget
          </p>
        </div>
        
        <Tabs 
          defaultValue="news" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="news" className="flex items-center gap-1">
              <FileText size={16} />
              <span className="hidden sm:inline">Notizie</span>
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-1">
              <Pencil size={16} />
              <span className="hidden sm:inline">Fonti</span>
            </TabsTrigger>
            <TabsTrigger value="styles" className="flex items-center gap-1">
              <PaintBucket size={16} />
              <span className="hidden sm:inline">Stili</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-1">
              <Mail size={16} />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-1">
              <HelpCircle size={16} />
              <span className="hidden sm:inline">Guida</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="news" className="border-none p-0 mt-4">
            <div className="flex justify-end mb-4">
              <Button onClick={handleAddNews} className="flex items-center gap-1">
                <Plus size={16} />
                Aggiungi Notizia
              </Button>
            </div>
            
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="w-full">Titolo</TableHead>
                    <TableHead>Fonte</TableHead>
                    <TableHead className="w-[100px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Nessuna notizia disponibile
                      </TableCell>
                    </TableRow>
                  ) : (
                    news.map(item => {
                      const source = sources.find(s => s.id === item.sourceId);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{formatDate(item.date)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <CategoryIcon category={item.category} size={16} />
                              <span className="hidden md:inline">{getCategoryName(item.category)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>{source?.name || 'Sconosciuta'}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditNews(item)}
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteNews(item.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="sources" className="border-none p-0">
            <SourcesManager 
              sources={sources}
              onUpdate={handleUpdateSources}
            />
          </TabsContent>
          
          <TabsContent value="styles" className="border-none p-0">
            <StylesCustomizer 
              settings={settings}
              onUpdate={handleUpdateSettings}
            />
          </TabsContent>
          
          <TabsContent value="email" className="border-none p-0">
            <EmailSettings
              settings={settings}
              onUpdate={handleUpdateSettings}
            />
          </TabsContent>
          
          <TabsContent value="guide" className="border-none p-0">
            <InstallationGuide />
          </TabsContent>
        </Tabs>
      </main>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <AdminNewsForm 
            onSave={handleSaveNews}
            onCancel={handleCloseDialog}
            initialData={currentNewsItem}
            sources={sources}
          />
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Admin;
