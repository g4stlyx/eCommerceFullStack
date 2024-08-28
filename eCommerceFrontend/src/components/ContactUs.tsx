import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const ContactUs: React.FC = () => {
  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Adres</Card.Title>
              <Card.Text>
                DSM Grup Danışmanlık İletişim ve Satış Ticaret A.Ş.
                <br />
                Maslak Mahallesi Saat Sokak Spine Tower No:5 İç Kapı No:19
                <br />
                Sarıyer/İstanbul
              </Card.Text>
              <Card.Text>
                <strong>Tel:</strong> 0 212 331 0 200
                <br />
                <strong>Maslak V.D.:</strong> 313 055 7669
                <br />
                <strong>Ticaret Sicil No:</strong> 711896
                <br />
                <strong>Kep Adresi:</strong> dsm@hs02.kep.tr
                <br />
                <strong>Mersis Numarası:</strong> 0313055766900016
                <br />
                <strong>Sorumlu Kişi:</strong> Yasin Canki
              </Card.Text>
              <Card.Text>
                Üyesi olduğumuz İstanbul Ticaret Odası’nın üyeleri için geçerli
                davranış kurallarına{' '}
                <a href="https://www.ito.org.tr" target="_blank" rel="noopener noreferrer">
                  www.ito.org.tr
                </a>{' '}
                adresinden ulaşılabilir.
              </Card.Text>
              <Card.Text>
                DSM Grup Danışmanlık İletişim ve Satış Tic. A.Ş.'ye yapılacak yasal
                bildirimler ve arabuluculuk başvuruları için Kayıtlı Elektronik Posta
                aracılığıyla{' '}
                <a href="mailto:dsm.hukuk@hs02.kep.tr">dsm.hukuk@hs02.kep.tr</a>{' '}
                adresine gönderebilirsiniz.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <div style={{ height: '300px', width: '100%', borderRadius: '5px', overflow: 'hidden' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d385398.20437417936!2d28.660274110033104!3d41.005321490489535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba396b6c16d7%3A0x5ffde0d64f1c4c3e!2sSpine%20Tower!5e0!3m2!1sen!2str!4v1693048962161!5m2!1sen!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Müşteri Hizmetleri</Card.Title>
              <Card.Text>
                Çağrı Merkezimiz hafta içi ve hafta sonu 08.30 / 24.00 saatleri
                arasında hizmet vermektedir.
              </Card.Text>
              <Card.Text>
                <strong>Çağrı Merkezi:</strong> 0 212 331 0 200
              </Card.Text>
              <Button variant="warning" size="lg">
                CANLI YARDIM DESTEĞİ
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
