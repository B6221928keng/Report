import img from './image/logo.jpg';
import { Container, Typography } from '@mui/material';
import home from './image/Home.jpg';
function Home() {
  return (
    <div>
      <Container className="container" maxWidth="md">
        <h1 style={{ textAlign: "center" }}>ระบบแจ้งปัญหาการใช้งาน Software</h1>
        <Typography component="h1" variant="h5">
          <img
            style={{
              width: "50%", // ปรับขนาดของรูปให้เต็มของพื้นที่ของ Container
              display: "block", // ให้รูปแสดงเป็นบล็อก (block element) เพื่อให้สามารถกำหนดขนาดและตำแหน่งได้
              margin: "0 auto", // จัดให้รูปแสดงตรงกลาง
            }}
            className="img"
            src={home}
            alt="Logo"
          />
        </Typography>
      </Container>
    </div>
  );
}

export default Home;
