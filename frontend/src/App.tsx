import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Button, CircularProgress, List, ListItem, ListItemIcon, ListItemText, Typography, Paper, Alert } from '@mui/material';
import { styled } from '@mui/system';
import { backend } from 'declarations/backend';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';

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

const ContentContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  overflowY: 'auto',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const NavigationContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#f5f5f5',
  height: '100%',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
}));

const MarkdownContent = styled('div')(({ theme }) => ({
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  '& p': {
    marginBottom: theme.spacing(2),
  },
  '& ul, & ol': {
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
  },
  '& li': {
    marginBottom: theme.spacing(1),
  },
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    marginBottom: theme.spacing(2),
  },
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.grey[300]}`,
    paddingLeft: theme.spacing(2),
    marginLeft: 0,
    marginRight: 0,
    fontStyle: 'italic',
  },
  '& table': {
    borderCollapse: 'collapse',
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  '& th, & td': {
    border: `1px solid ${theme.palette.grey[300]}`,
    padding: theme.spacing(1),
  },
  '& tr:nth-of-type(even)': {
    backgroundColor: theme.palette.grey[50],
  },
}));

interface MarkdownFile {
  id: number;
  name: string;
  content: string;
  createdAt: number;
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp / 1000000);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const App: React.FC = () => {
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const fetchAllFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await backend.getAllMarkdownFiles();
      setFiles(result);
    } catch (error) {
      console.error('Error fetching files:', error);
      setError('Failed to fetch files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Navigation: React.FC = () => (
    <NavigationContainer>
      <List>
        {files.map((file) => (
          <StyledListItem key={file.id} component={Link} to={`/file/${file.id}`}>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText 
              primary={file.name}
              secondary={formatDate(file.createdAt)}
            />
          </StyledListItem>
        ))}
        <StyledListItem component={Link} to="/new">
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add New File" />
        </StyledListItem>
      </List>
    </NavigationContainer>
  );

  const FileUploader: React.FC = () => {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSave = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await backend.saveMarkdownFile(name, content);
        if ('ok' in result) {
          console.log('File saved with ID:', result.ok);
          await fetchAllFiles();
          navigate(`/file/${result.ok}`);
        } else {
          setError('Error saving file: ' + result.err);
        }
      } catch (error) {
        console.error('Error saving file:', error);
        setError('Failed to save file. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <StyledTextField
          fullWidth
          label="File Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <StyledTextField
          fullWidth
          multiline
          rows={10}
          label="Markdown Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <StyledButton
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save File'}
        </StyledButton>
        {error && <Alert severity="error">{error}</Alert>}
      </>
    );
  };

  const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const renderMarkdown = (text: string): React.ReactNode => {
      const lines = text.split('\n');
      let inCodeBlock = false;
      let codeContent = '';

      return lines.map((line, index) => {
        if (line.startsWith('```')) {
          if (inCodeBlock) {
            inCodeBlock = false;
            const result = (
              <pre key={index}>
                <code>{codeContent}</code>
              </pre>
            );
            codeContent = '';
            return result;
          } else {
            inCodeBlock = true;
            return null;
          }
        }

        if (inCodeBlock) {
          codeContent += line + '\n';
          return null;
        }

        if (line.startsWith('# ')) {
          return <Typography key={index} variant="h1">{line.slice(2)}</Typography>;
        } else if (line.startsWith('## ')) {
          return <Typography key={index} variant="h2">{line.slice(3)}</Typography>;
        } else if (line.startsWith('### ')) {
          return <Typography key={index} variant="h3">{line.slice(4)}</Typography>;
        } else if (line.startsWith('- ')) {
          return <Typography key={index} component="li">{line.slice(2)}</Typography>;
        } else if (line.startsWith('> ')) {
          return <blockquote key={index}>{line.slice(2)}</blockquote>;
        } else if (line.startsWith('![')) {
          const match = line.match(/!\[(.*?)\]\((.*?)\)/);
          if (match) {
            return <img key={index} src={match[2]} alt={match[1]} />;
          }
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          return <Typography key={index} paragraph>{line}</Typography>;
        }
      });
    };

    return <MarkdownContent>{renderMarkdown(content)}</MarkdownContent>;
  };

  const FileViewer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [file, setFile] = useState<MarkdownFile | null>(null);
    const [fileLoading, setFileLoading] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);

    useEffect(() => {
      if (id) {
        fetchFile(parseInt(id));
      }
    }, [id]);

    const fetchFile = async (fileId: number) => {
      setFileLoading(true);
      setFileError(null);
      try {
        const result = await backend.getMarkdownFile(fileId);
        if ('ok' in result) {
          setFile(result.ok);
        } else {
          setFileError('Error fetching file: ' + result.err);
        }
      } catch (error) {
        console.error('Error fetching file:', error);
        setFileError('Failed to fetch file. Please try again.');
      } finally {
        setFileLoading(false);
      }
    };

    if (fileLoading) {
      return <CircularProgress />;
    }

    if (fileError) {
      return <Alert severity="error">{fileError}</Alert>;
    }

    if (!file) {
      return <Typography>No file found.</Typography>;
    }

    return (
      <>
        <Typography variant="h4" gutterBottom>{file.name}</Typography>
        <Typography variant="subtitle2" gutterBottom>
          Created: {formatDate(file.createdAt)}
        </Typography>
        <MarkdownRenderer content={file.content} />
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
          <ContentContainer>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            <Routes>
              <Route path="/" element={<Typography variant="h4">Welcome to the Markdown Documentation Site</Typography>} />
              <Route path="/new" element={<FileUploader />} />
              <Route path="/file/:id" element={<FileViewer />} />
            </Routes>
          </ContentContainer>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default App;
