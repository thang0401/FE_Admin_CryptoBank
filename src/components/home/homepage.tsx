import { Check, Label } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  List,
  ListItem,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import React, { useContext } from 'react'
import { tw, css } from 'twind/css'
import router from 'next/router'
import { useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
const SOLANA_MAINNET = 'https://api.mainnet-beta.solana.com' //
const SOLANA_DEVNET = 'https://api.devnet.solana.com'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { TokenData, assetType } from './type'
import { auto } from '@popperjs/core'
import themeConfig from 'src/configs/themeConfig'
import { getLocalstorage } from 'src/utils/localStorageSide'

// import Preferences from '@/constants/svg/preferences.svg';
// import Play from '@/constants/svg/play.svg';

const listItems = [
  {
    title: `Giấu tài sản, bảo mật tuyệt đối`,
    description: `Nếu bạn lưu trữ tiền ở các ví web3 truyền thống, bất kỳ ai publickey ví của bạn cũng sẽ biết được số dư trong tài khoản của bạn, Ứng dụng chúng tôi giấu đi số dư của bạn, đảm bảo không ai ngoài bạn có thể biết về số lượng tài sản bạn sở hữu.`
  },
  {
    title: `Lập di chúc kế thừa tài sản`,
    description: `Crypto Depot cung cấp cho bạn tính năng lập di chúc kế thừa tài cho người khác, sản  Nếu bạn gặp sự việc gì bất trắc, hay chỉ đơn giản là muốn chuyển toàn bộ tài sản trong danh mục lưu trữ cho người khác `
  },

  {
    title: `Người mới tham gia crypto`,
    description: `Bạn mới bước vào thế giới crypto? Lo lắng về việc đầu tư và lưu trữ tài sản? Crypto Depot sẽ giúp bạn yên tâm hơn. Không cần lưu trữ trên sàn giao dịch - nơi tiềm ẩn nguy cơ sập sàn và mất trắng tài sản.`
  },
  {
    title: `Quản lý ví đơn giản như ví web2`,
    description: `Không cần phải rành rẽ về cách sử dụng ví Web3. Chúng tôi tối ưu hóa quy trình quản lý ví như các ví thông thường trên thị trường như Momo, Viettel Money ... để bạn có thể sử dụng dễ dàng mà không cần lo lắng về các thao tác phức tạp.`
  },
  {
    title: `Bảo vệ tài sản khỏi nguy cơ mất mát`,
    description: `Bạn sợ quên hoặc mất private key hay 12 cụm từ khôi phục ví? Với Crypto Depot, bạn không còn phải lo việc mất quyền truy cập vào tài sản của mình, đồng thời giảm thiểu rủi ro bị đánh cắp ví do lộ thông tin private key.`
  },
  {
    title: `Đơn giản hóa mọi giao dịch`,
    description: `Việc chuyển tiền vào ví nóng, ví lạnh hay giao dịch với người khác trở nên dễ dàng hơn bao giờ hết. Chúng tôi giúp bạn thực hiện dưới tên và danh mục đầu tư của chủ sở hữu, thay thế cho việc chuyển tiền qua public key như các ví web3, nhanh chóng và thuận tiện hơn.`
  },
  {
    title: `Chuyển crypto cho người khác ngay cả khi họ chưa có ví Web3`,
    description: `Với Crypto Depot, bạn có thể dễ dàng chuyển tiền cho bất kỳ ai, ngay cả khi họ chưa sở hữu ví Web3.Chỉ cần tạo tài khoản trong vòng 3p và bạn có thể chuyển tiền cho bất kỳ ai.`
  }
]

const socialProofs = [
  {
    name: `John Doe`,
    company: `Alphabet Inc.`,
    image: `/images/social-1.webp`,
    text: `Commodo Lorem consequat ea consectetur pariatur proident excepteur.
    Pariatur eiusmod minim minim ipsum tempor aute excepteur minim eu nisi laboris.
    Duis sunt labore eu eu cupidatat labore commodo id aliquip.`
  },
  {
    name: `Jack Doe`,
    company: `Amazon.com, Inc.`,
    image: `/images/social-2.webp`,
    text: `Anim labore ut amet cupidatat pariatur pariatur labore ad est.
    Fugiat eiusmod dolore aliquip aute duis esse excepteur amet.
    Sit cupidatat ipsum culpa nisi esse ipsum culpa in consectetur.
    Enim incididunt do sunt ex do. Proident duis nulla minim sunt irure est
    magna nostrud Lorem consectetur irure.`
  }
]

// const headerStyle = css`
//   background-color: #ffffff;
//   min-height: calc(100vh - 6rem);
// `

export default function homepage() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [currentIndex, setCurrentIndex]: any = useState(0)
  const next = () => {
    if (currentIndex + 1 < socialProofs.length) {
      setCurrentIndex(currentIndex + 1)
    }
  } // eslint-disable-next-line react-hooks/rules-of-hooks
  const [publicKey, setPublicKey] = useState('9d5jmHCZT3hqDmjtLsdYnJoktdnF77pxDbEWkGmMi9gG')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error, setError] = useState('')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tokens, setTokens] = useState<TokenData[]>([])

  const tokenNameMap = {
    '4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ': 'SFC-VND',
    '8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He': 'LPSFC'
  }

  // Hàm gọi API lấy token
  const fetchTokenData = async (pubKey: string) => {
    try {
      setError('') // Clear lỗi trước
      const connection = new Connection(SOLANA_DEVNET)

      // Kiểm tra xem publicKey có hợp lệ không
      const userPublicKey = new PublicKey(pubKey)

      const solBalanceLamports = await connection.getBalance(userPublicKey)
      const solBalance = solBalanceLamports / 1e9 // Chuyển đổi từ lamports sang SOL

      // Lấy danh sách token accounts thuộc về public key
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userPublicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') // Token Program ID
      })

      const tokensData: TokenData[] = tokenAccounts.value.map(accountInfo => {
        const tokenAmount = accountInfo.account.data.parsed.info.tokenAmount.uiAmountString
        const tokenMint = accountInfo.account.data.parsed.info.mint
        return {
          mint: tokenMint,
          amount: tokenAmount,
          symbol: tokenMint in tokenNameMap ? tokenNameMap[tokenMint as keyof typeof tokenNameMap] : 'Unknown'
        }
      })
      const allTokens = [
        {
          mint: 'SOL',
          amount: solBalance.toString(),
          symbol: 'SOL'
        },
        ...tokensData
      ]
      setTokens(allTokens) // Cập nhật dữ liệu bảng với thông tin token
    } catch (err) {
      setError('Không tìm thấy public key hoặc xảy ra lỗi khi tra cứu.')
      setTokens([]) // Xóa dữ liệu bảng nếu lỗi
    }
  }

  // Xử lý sự kiện submit form
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (publicKey.trim() === '') {
      setError('Public key không được để trống.')
      return
    }

    fetchTokenData(publicKey)
  }

  const previous = () => {
    if (currentIndex - 1 >= 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }
  const handleRedirectRegister = () => {
    router.push('/register')
  }
  console.log(getLocalstorage('settings'))

  return (
    <Box >
      <Grid
        container
        width={'100%'}
        sx={
          getLocalstorage('settings')?.mode === 'dark'
            ? { background: '#2B2C40', color: 'white' }
            : { background: '#fff' }
        }
      >
        <Box sx={{ mx: auto, p: 4 }}>
          <Typography
            sx={
              getLocalstorage('settings')?.mode === 'dark'
                ? { background: '#2B2C40', color: 'white' }
                : { background: '#fff' }
            }
            variant='h1'
            style={{ textAlign: 'center', fontFamily: 'sans-serif' }}
          >
            Bảo vệ tài sản số của bạn với Crypto Depot
          </Typography>
          <div className={tw(`max-w-xl mx-auto`)}>
            <p className={tw(`mt-10 text-gray-500 text-center text-xl lg:text-3xl`)}>
              Cung cấp giải pháp lưu trữ và giao dịch đơn giản, an toàn và bảo mật số dư số dư tiền điện tử của bạn.
            </p>
          </div>
        </Box>
      </Grid>

      <Grid container spacing={3} display={'flex'} width={'100%'} marginTop={4}>
        <Grid item xs={12} sm={8}>
          <Card sx={{ padding: 3, boxShadow: 3 }}>
            <Typography sx={{ mt: 2, mb: 2, fontWeight: 500, color: 'primary.main' }}>Bạn có biết?</Typography>
            <Typography sx={{ mb: 3, color: 'text.secondary' }}>
              Nếu bạn lưu trữ tiền ở các ví web3 truyền thống, bất kỳ ai publickey ví của bạn cũng sẽ biết được số dư
              trong tài khoản của bạn, Ứng dụng chúng tôi giấu đi số dư của bạn, đảm bảo không ai ngoài bạn có thể biết
              về số lượng tài sản bạn sở hữu.
            </Typography>
            <Grid>
              <Typography sx={{ fontWeight: 500, mb: 2 }}>Nhập public key bạn muốn kiểm tra số dư tại đây</Typography>
              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <FormControl error={Boolean(error)} sx={{ maxWidth: '100%' }}>
                    <Input
                      placeholder='Dùng Devnet publickey không dùng Mainnet publickey'
                      value={publicKey}
                      onChange={e => setPublicKey(e.target.value)}
                      sx={{
                        padding: '10px',
                        border: '1px solid',
                        borderColor: error ? 'error.main' : 'divider',
                        borderRadius: 1,
                        width: '100%'
                      }}
                    />
                    {error && (
                      <FormHelperText sx={{ mt: 1, color: 'error.main' }}>
                        <InfoOutlined sx={{ verticalAlign: 'middle', mr: 1 }} />
                        {error}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <Button type='submit' variant='contained' color='primary' sx={{ alignSelf: 'flex-start' }}>
                    Tra cứu
                  </Button>
                </Stack>
              </form>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ padding: 3, boxShadow: 3 }}>
            <Typography sx={{ fontWeight: 500, mb: 2 }}>Số dư của tài khoản tra cứu bao gồm:</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 2, fontWeight: 600 }}>STT</TableCell>
                  <TableCell sx={{ py: 2, fontWeight: 600 }}>Loại tài sản</TableCell>
                  <TableCell sx={{ py: 2, fontWeight: 600 }}>Số lượng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tokens.length > 0 ? (
                  tokens.map((token, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ py: 2 }}>{index + 1}</TableCell>
                      <TableCell sx={{ py: 2 }}>{token.symbol}</TableCell>
                      <TableCell sx={{ py: 2 }}>{token.amount}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}>
                      Tra cứu tài sản ngay!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>


        <Box sx={{ py: { lg: 8, xs: 4 }, overflow: 'hidden' }}>
          <Card>
          <Container maxWidth='lg' sx={{ p: { xs: 4, sm: 6, lg: 8 } }}>
            <Box textAlign='center' mb={8}>
              <Typography
                variant='h6'
                sx={{ color: 'indigo', fontWeight: 'bold', letterSpacing: 1.5, textTransform: 'uppercase' }}
              >
                Crypto Depot
              </Typography>
              <Typography variant='h2' sx={{ mt: 2, pb: 4, fontWeight: 'bold', color: 'gray.900' }}>
                Vì sao bạn phải chọn chúng tôi?
              </Typography>
            </Box>
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={12} lg={6}>
                <List>
                  {listItems.map((item, index) => (
                    <ListItem key={item.title} sx={{ display: 'flex', px: 4 }}>
                      <Avatar sx={{ bgcolor: 'blue.50', color: 'blue.500', width: 56, height: 56 }}>
                        <Typography variant='h6'>{index + 1}</Typography>
                      </Avatar>
                      <ListItemText
                        primary={item.title}
                        secondary={item.description}
                        primaryTypographyProps={{ variant: 'h6', my: 1 }}
                        secondaryTypographyProps={{ sx: { color: 'gray.500', lineHeight: 1.5 } }}
                        sx={{ ml: 4 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} lg={6}></Grid>
            </Grid>
          </Container>
          </Card>
        </Box>


      {/* FeatureSection */}
      <Card>
        <Grid
          container
          sx={{
            minHeight: '100vh', // Ensures the Grid container takes the full viewport height
            justifyContent: 'center', // Centers content horizontally
            alignItems: 'center' // Centers content vertically
          }}
        >
          <Grid marginBottom={-20} width={'100%'}>
            {' '}
            <p className={tw(`text-gray-500 text-center text-xl lg:text-3xl`)}> FAQ </p>
          </Grid>

          <Grid
            item
            xs={12}
            sm={10}
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: { lg: 0, xs: 5 }
            }}
          >
            <Card sx={{ width: '100%' }}>
              <Accordion>
                <AccordionSummary>
                  <Typography sx={{ fontWeight: '500' }}>CryptoDepot là gì?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Trả lời: CryptoDepot là một nền tảng Web3 giúp người dùng dễ dàng quản lý tài sản tiền điện tử mà
                    không cần phải tự quản lý ví và chìa khóa riêng tư. Thay vì sử dụng địa chỉ ví và khóa riêng tư, bạn
                    chỉ cần sử dụng Username và Password để thực hiện tất cả các hoạt động liên quan đến Web3.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>
                  <Typography sx={{ fontWeight: '500' }}>
                    CryptoDepot có lưu trữ ví và tài sản của tôi không?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Trả lời: Đúng vậy. CryptoDepot sử dụng một ví Web3 duy nhất để quản lý tài sản của tất cả người
                    dùng. Điều này có nghĩa là chúng tôi sẽ thao tác với Web3 thay mặt cho bạn và đảm bảo rằng tài sản
                    của bạn được quản lý an toàn trong ví lưu ký (custodial wallet) của chúng tôi.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>
                  <Typography sx={{ fontWeight: '500' }}>Làm thế nào để tôi đăng ký và sử dụng CryptoDepot?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Trả lời: Để sử dụng CryptoDepot, bạn chỉ cần đăng ký với một Username và Password trên hệ thống của
                    chúng tôi. Sau khi đăng nhập, bạn có thể quản lý tài sản Web3 của mình mà không cần phải tự tạo ví
                    hay quản lý khóa riêng tư.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary>
                  <Typography sx={{ fontWeight: '500' }}>Tôi có thể nhận tài sản Web3 từ các ví khác không?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Trả lời: Có. Bạn có thể sử dụng Username của mình để nhận tài sản từ bất kỳ ví Web3 nào khác mà
                    không cần đăng nhập vào hệ thống. Mọi giao dịch đến Username của bạn sẽ được chuyển hướng đến ví của
                    CryptoDepot, và hệ thống sẽ cập nhật số dư tương ứng cho bạn.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary>
                  <Typography sx={{ fontWeight: '500' }}>
                    Làm thế nào để tôi chuyển tài sản giữa các Username?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Trả lời: Khi bạn đăng nhập vào CryptoDepot, bạn có thể thực hiện chuyển tài sản Web3 cho bất kỳ
                    Username nào khác trong hệ thống. Chúng tôi sẽ cập nhật số dư của bạn và người nhận trong cơ sở dữ
                    liệu mà không cần thao tác trực tiếp trên blockchain, giúp tiết kiệm chi phí và thời gian giao dịch.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>
                  <Typography sx={{ fontWeight: '500' }}>CryptoDepot có phí giao dịch không?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Trả lời: Phí giao dịch trên CryptoDepot được tối ưu hóa. Chúng tôi xử lý phần lớn các giao dịch trên
                    hệ thống nội bộ của mình và chỉ tương tác với blockchain khi cần thiết, giúp giảm thiểu phí giao
                    dịch mà bạn phải trả.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>
                  <Typography sx={{ fontWeight: '500' }}>
                    Tôi có cần phải biết về Web3 hay blockchain để sử dụng CryptoDepot không?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Trả lời: Không. Một trong những mục tiêu chính của CryptoDepot là làm cho Web3 dễ tiếp cận với tất
                    cả mọi người, kể cả những người không có kiến thức kỹ thuật về blockchain. Bạn chỉ cần sử dụng
                    Username và Password mà không cần phải biết về ví, khóa riêng tư hay các thuật ngữ kỹ thuật khác.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>
                  <Typography sx={{ fontWeight: '500' }}>Điều gì sẽ xảy ra nếu tôi quên mật khẩu?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Trả lời: Nếu bạn quên mật khẩu, bạn có thể sử dụng tính năng khôi phục mật khẩu của chúng tôi để đặt
                    lại mật khẩu mới. Hệ thống sẽ yêu cầu bạn cung cấp thông tin xác thực để đảm bảo rằng bạn là chủ sở
                    hữu của tài khoản.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>
                  <Typography sx={{ fontWeight: '500' }}>
                    CryptoDepot có hỗ trợ giao dịch xuyên chuỗi (cross-chain) không?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Trả lời: Hiện tại, CryptoDepot tập trung vào một số blockchain nhất định, nhưng chúng tôi đang
                    nghiên cứu và phát triển để hỗ trợ giao dịch xuyên chuỗi trong tương lai.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Card>
          </Grid>
        </Grid>
      </Card>


        <Box sx={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)', pt: 12 }}>
          <Card>
          <Container maxWidth='lg' sx={{ mb: 5, position: 'relative' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} marginTop={4} lg={8} sx={{ py: 8, px: { xs: 6, md: 0, }, flexShrink: 1 }}>
                <Typography variant='h3' sx={{ fontWeight: 'bold', color: 'gray.800', mb: 12 }}>
                  Tạo tài khoản?
                </Typography>
                <Typography variant='body1' sx={{ mt: 6, color: 'gray.500', lineHeight: 1.6 }}>
                  Bắt đầu hành trình đầu tư tiền điện tử một cách an toàn với CryptoDepot. Bạn có sẵn sàng bảo vệ tài
                  sản số của mình khỏi những rủi ro thường gặp trong thị trường crypto chưa? Với CryptoDepot, chúng tôi
                  mang đến một giải pháp lưu ký tiền điện tử toàn diện, giúp bạn dễ dàng quản lý tài sản mà không phải
                  lo lắng về bảo mật và thao tác phức tạp.
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                lg={4}
                sx={{
                  py: 8,
                  px: 6,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Typography variant='h6' sx={{ fontWeight: 'medium', color: 'gray.800' }}>
                  Đăng ký tài khoản ngay để nhận $5 đô phí giao dịch
                </Typography>
                <Box sx={{ my: 4, fontSize: '3rem', fontWeight: 'bold', color: 'gray.800' }}></Box>
                <Button onClick={handleRedirectRegister} variant='outlined'>
                  Tạo tài khoản ngay
                </Button>
              </Grid>
            </Grid>
          </Container>
          </Card>
        </Box>

    </Box>
  )
}
