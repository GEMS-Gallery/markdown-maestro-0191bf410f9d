import React, { useState } from 'react';
import { Container, Grid, TextField, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { backend } from 'declarations/backend';

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

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  const handleFormatMarkdown = async () => {
    setLoading(true);
    try {
      const result = await backend.saveMarkdown(markdown);
      if ('ok' in result) {
        console.log('Markdown saved with ID:', result.ok);
      } else {
        console.error('Error saving markdown:', result.err);
      }
    } catch (error) {
      console.error('Error formatting markdown:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadHTML = () => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Formatted Markdown</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          pre {
            background-color: #f6f8fa;
            border-radius: 3px;
            padding: 16px;
          }
          code {
            font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
          }
        </style>
      </head>
      <body>
        ${renderMarkdown(markdown)}
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted_markdown.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMarkdown = (text: string): string => {
    // This is a very basic markdown renderer. It only handles some simple cases.
    // For a full markdown parser, you'd need a more complex solution.
    const lines = text.split('\n');
    let html = '';
    let inCodeBlock = false;

    for (const line of lines) {
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        html += inCodeBlock ? '<pre><code>' : '</code></pre>';
      } else if (inCodeBlock) {
        html += line + '\n';
      } else if (line.startsWith('# ')) {
        html += `<h1>${line.slice(2)}</h1>`;
      } else if (line.startsWith('## ')) {
        html += `<h2>${line.slice(3)}</h2>`;
      } else if (line.startsWith('### ')) {
        html += `<h3>${line.slice(4)}</h3>`;
      } else if (line.startsWith('- ')) {
        html += `<li>${line.slice(2)}</li>`;
      } else {
        html += `<p>${line}</p>`;
      }
    }

    return html;
  };

  return (
    <StyledContainer maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledTextField
            fullWidth
            multiline
            rows={20}
            variant="outlined"
            label="Markdown Input"
            value={markdown}
            onChange={handleMarkdownChange}
          />
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleFormatMarkdown}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Format Markdown'}
          </StyledButton>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDownloadHTML}
            disabled={loading}
          >
            Download Formatted HTML
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <PreviewContainer>
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />
          </PreviewContainer>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default App;
