import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Button, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { backend } from 'declarations/backend';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const PreviewContainer = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  overflowY: 'auto',
}));

interface DocSection {
  id: number;
  title: string;
  content: string;
}

const App: React.FC = () => {
  const [sections, setSections] = useState<DocSection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllSections();
  }, []);

  const fetchAllSections = async () => {
    setLoading(true);
    try {
      const result = await backend.getAllDocSections();
      setSections(result);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const Navigation: React.FC = () => (
    <List>
      {sections.map((section) => (
        <ListItem key={section.id} component={Link} to={`/section/${section.id}`}>
          <ListItemText primary={section.title} />
        </ListItem>
      ))}
      <ListItem component={Link} to="/new">
        <ListItemText primary="Add New Section" />
        <AddIcon />
      </ListItem>
    </List>
  );

  const SectionEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
      if (id) {
        fetchSection(parseInt(id));
      }
    }, [id]);

    const fetchSection = async (sectionId: number) => {
      setLoading(true);
      try {
        const result = await backend.getDocSection(sectionId);
        if ('ok' in result) {
          setTitle(result.ok.title);
          setContent(result.ok.content);
        } else {
          console.error('Error fetching section:', result.err);
        }
      } catch (error) {
        console.error('Error fetching section:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleSave = async () => {
      setLoading(true);
      try {
        const result = await backend.saveDocSection(title, content);
        if ('ok' in result) {
          console.log('Section saved with ID:', result.ok);
          fetchAllSections();
        } else {
          console.error('Error saving section:', result.err);
        }
      } catch (error) {
        console.error('Error saving section:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <StyledTextField
          fullWidth
          label="Section Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <StyledTextField
          fullWidth
          multiline
          rows={10}
          label="Section Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <StyledButton
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Section'}
        </StyledButton>
      </>
    );
  };

  const SectionViewer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [section, setSection] = useState<DocSection | null>(null);

    useEffect(() => {
      if (id) {
        fetchSection(parseInt(id));
      }
    }, [id]);

    const fetchSection = async (sectionId: number) => {
      setLoading(true);
      try {
        const result = await backend.getDocSection(sectionId);
        if ('ok' in result) {
          setSection(result.ok);
        } else {
          console.error('Error fetching section:', result.err);
        }
      } catch (error) {
        console.error('Error fetching section:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!section) {
      return <Typography>Loading...</Typography>;
    }

    return (
      <>
        <Typography variant="h4">{section.title}</Typography>
        <Typography>{section.content}</Typography>
      </>
    );
  };

  return (
    <StyledContainer maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Navigation />
        </Grid>
        <Grid item xs={12} md={9}>
          <Routes>
            <Route path="/" element={<Typography variant="h4">Welcome to the Documentation Site</Typography>} />
            <Route path="/new" element={<SectionEditor />} />
            <Route path="/section/:id" element={<SectionViewer />} />
            <Route path="/edit/:id" element={<SectionEditor />} />
          </Routes>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default App;
