import img from './image/logo.jpg';
import { Container, Typography } from '@mui/material';

function Home() {

    return (
        <div>
        <Container className="container" maxWidth="md">
          <h1 style={{ textAlign: "center" }}>ระบบแจ้งปัญหาการใช้งานSoftware</h1>
        <Typography component="h1" variant="h5">
          <img style={{width:"900px"}} className="img" src={img}/>
        </Typography>
      </Container>
    </div>
    )
}
export default Home;