import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreatePost } from '@/hooks/usePosts';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Send,
  Plus,
  Clock,
  FileText
} from 'lucide-react';

interface Draft {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const Drafts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createPost = useCreatePost();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [editingDraft, setEditingDraft] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [newDraftContent, setNewDraftContent] = useState('');
  const [showNewDraft, setShowNewDraft] = useState(false);

  // Load drafts from localStorage on component mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem('studenthub_drafts');
    if (savedDrafts) {
      try {
        const parsedDrafts = JSON.parse(savedDrafts).map((draft: any) => ({
          ...draft,
          createdAt: new Date(draft.createdAt),
          updatedAt: new Date(draft.updatedAt),
        }));
        setDrafts(parsedDrafts);
      } catch (error) {
        console.error('Error loading drafts:', error);
      }
    }
  }, []);

  // Save drafts to localStorage whenever drafts change
  useEffect(() => {
    localStorage.setItem('studenthub_drafts', JSON.stringify(drafts));
  }, [drafts]);

  const createNewDraft = () => {
    if (!newDraftContent.trim()) return;

    const newDraft: Draft = {
      id: Date.now().toString(),
      content: newDraftContent.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setDrafts(prev => [newDraft, ...prev]);
    setNewDraftContent('');
    setShowNewDraft(false);

    toast({
      title: "Draft saved!",
      description: "Your draft has been saved successfully.",
    });
  };

  const updateDraft = (id: string) => {
    if (!editContent.trim()) return;

    setDrafts(prev => prev.map(draft => 
      draft.id === id 
        ? { ...draft, content: editContent.trim(), updatedAt: new Date() }
        : draft
    ));

    setEditingDraft(null);
    setEditContent('');

    toast({
      title: "Draft updated!",
      description: "Your draft has been updated successfully.",
    });
  };

  const deleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(draft => draft.id !== id));
    
    toast({
      title: "Draft deleted",
      description: "Your draft has been deleted.",
    });
  };

  const publishDraft = async (draft: Draft) => {
    try {
      await createPost.mutateAsync(draft.content);
      deleteDraft(draft.id);
      
      toast({
        title: "Post published!",
        description: "Your draft has been published successfully.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Failed to publish",
        description: "Could not publish your draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startEditing = (draft: Draft) => {
    setEditingDraft(draft.id);
    setEditContent(draft.content);
  };

  const cancelEditing = () => {
    setEditingDraft(null);
    setEditContent('');
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Drafts</h1>
                <p className="text-sm text-gray-500">{drafts.length} drafts</p>
              </div>
            </div>
            <Button
              onClick={() => setShowNewDraft(true)}
              size="sm"
              className="rounded-full"
            >
              <Plus size={16} className="mr-1" />
              New
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* New Draft Form */}
        {showNewDraft && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Create New Draft</h3>
            <Textarea
              value={newDraftContent}
              onChange={(e) => setNewDraftContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[120px] mb-3"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowNewDraft(false);
                  setNewDraftContent('');
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={createNewDraft}
                disabled={!newDraftContent.trim()}
              >
                Save Draft
              </Button>
            </div>
          </div>
        )}

        {/* Drafts List */}
        {drafts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No drafts yet</h3>
            <p className="text-gray-500 mb-4">
              Save your thoughts as drafts and publish them when you're ready.
            </p>
            <Button onClick={() => setShowNewDraft(true)}>
              Create your first draft
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <div key={draft.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {editingDraft === draft.id ? (
                  // Edit Mode
                  <div>
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[120px] mb-3"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateDraft(draft.id)}
                        disabled={!editContent.trim()}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>Created {formatDate(draft.createdAt)}</span>
                        {draft.updatedAt.getTime() !== draft.createdAt.getTime() && (
                          <>
                            <span>•</span>
                            <span>Updated {formatDate(draft.updatedAt)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-900 mb-4 leading-relaxed">
                      {draft.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditing(draft)}
                          className="flex items-center space-x-1"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteDraft(draft.id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </Button>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => publishDraft(draft)}
                        disabled={createPost.isPending}
                        className="flex items-center space-x-1"
                      >
                        <Send size={14} />
                        <span>{createPost.isPending ? 'Publishing...' : 'Publish'}</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drafts;