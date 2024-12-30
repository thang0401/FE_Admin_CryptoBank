import * as React from 'react'
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardActionArea, CardContent, CardMedia, Box, List, ListItem, ListItemText, Divider } from '@mui/material'
import { styled } from '@mui/system'

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(4),
}))

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: 160,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: 200,
  },
}))

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flex: 1,
}))

// Mock data for blog posts
const blogPosts = [
  { id: 4, title: 'SUI: Hệ sinh thái phi tập trung hiệu quả và an toàn', excerpt: ' Dự án SUI là một blockchain hiệu suất cao, mang lại sự an toàn và khả năng mở rộng vượt trội nhờ vào mô hình dữ liệu đối tượng', image: '/sui-placeholder.svg?height=200&width=300' },
  { id: 5, title: 'NEAR: Blockchain thân thiện với nhà phát triển và người dùng', excerpt: ' NEAR Protocol là một blockchain hiệu suất cao, thân thiện với nhà phát triển và người dùng.', image: '/near-placeholder.svg?height=200&width=300' },
  { id: 6, title: 'SOLANA: Blockchain nhanh và chi phí thấp', excerpt: 'Solana là một blockchain siêu nhanh với chi phí giao dịch cực thấp, thu hút nhiều dự án DeFi, NFT và Web3.', image: '/solana-placeholder.svg?height=200&width=300' },
  { id: 1, title: 'Tương lai của Defi', excerpt: 'Khám phá sự tiềm năng của tài chính phi tập trung', image: '/placeholder.svg?height=200&width=300' },
  { id: 2, title: 'NFTs: Nghệ thuật kỹ thuật số', excerpt: 'Non-fungible tokens đang cách mạng hóa các ngành công nghiệp khác nhau như thế nào...', image: '/placeholder.svg?height=200&width=300' },
  { id: 3, title: 'Web3 và nhà sáng tạo kinh tế', excerpt: 'Blockchain đang trao quyền cho nhà sáng tạo nội dung như thế nào', image: '/placeholder.svg?height=200&width=300' },

]

// Mock data for categories
const categories = ['DeFi', 'NFTs', 'DAOs', 'Layer 2 ', 'Metaverse']

export default function Blog() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
        <h2 style={{ textAlign: 'center', textTransform: 'uppercase', marginLeft: 30 }}>Web3 và Crypto Blog</h2>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              Bài viết mới nhất
            </Typography>
            {blogPosts.map((post) => (
              <StyledCard key={post.id}>
                <CardActionArea sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                  <StyledCardMedia
                    // component="img"
                    // image={post.image}
                    // alt={post.title}
                  />
                  <StyledCardContent>
                    <Typography component="h2" variant="h5">
                      {post.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {new Date().toLocaleDateString()}
                    </Typography>
                    <Typography variant="subtitle1" paragraph>
                      {post.excerpt}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      Tiếp tục đọc ...
                    </Typography>
                  </StyledCardContent>
                </CardActionArea>
              </StyledCard>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              Danh mục
            </Typography>
            <Card>
              <List>
                {categories.map((category, index) => (
                  <React.Fragment key={category}>
                    <ListItem button>
                      <ListItemText primary={category} />
                    </ListItem>
                    {index < categories.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
