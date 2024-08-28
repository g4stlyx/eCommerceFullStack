import React from "react";
import { Accordion, Card } from "react-bootstrap";
import "../styles/Faq.css";

const Faq: React.FC = () => {
  const faqData: { question: string; answer: string }[] = [
    {
      question:
        "Siparişimin teslimat adresini veya alıcı adını değiştirebilir miyim?",
      answer:
        "Siparişin teslimat adresini veya alıcı adını sipariş onayından sonra değiştiremezsiniz.",
    },
    {
      question: "Ücret iadem ne zaman yapılır?",
      answer: `İptal ettiğiniz ürünün ücret iadesi bankanıza bağlı olarak değişkenlik gösterebilir.
               Bu süre yaklaşık 1 haftayı bulabilir. İade ettiğiniz ürünün ücret iade süreci 
               aşağıdaki gibidir:\n
               • Ürün satıcıya ulaştıktan sonra en geç 48 saat içerisinde ödeme yapmış olduğunuz 
                 kartınıza yansır.\n
               • Ürün iade şartlarına uygunsa, iadeniz onaylanır ve ücret iadeniz bankanıza bağlı 
                 olarak 2-10 iş günü içerisinde yapılır.\n
               • Ürün iade şartlarına uygun değilse adresinize geri gönderilir.\n
               Not:
               • Bankanıza ücret iadesi yapıldığında üyelik e-posta adresinize bilgilendirme 
                 mesajı gönderilir.\n
               • Banka kartına yapılan iadelerin hesabınıza yansıma süresi bankanıza bağlıdır.\n
               • Bankanızdan ücret iadesi kontrolü yapmak için "Hesabım" > "Siparişlerim" adımından 
                 referans numaranızı görüntüleyebilirsiniz.\n
               • Taksitli yapılan alışverişlerin ücreti bankaya tek seferde ödenir ancak bankanız bu 
                 tutarı kredi kartınıza taksitli bir şekilde iade eder.`,
    },
    {
      question: "Siparişim ne zaman gelir?",
      answer:
        "Siparişinizin tahmini teslimat süresi ürün sayfasında belirtilmiştir.",
    },
    {
      question: "Siparişimi nasıl iptal edebilirim?",
      answer:
        "Siparişinizi iptal etmek için lütfen müşteri hizmetlerimiz ile iletişime geçin.",
    },
  ];

  return (
    <div className="faq-container">
      <Card className="faq-title-box">
        <Card.Body>
          <Card.Title>Sıkça Sorulan Sorular</Card.Title>
        </Card.Body>
      </Card>
      <Accordion>
        {faqData.map((item, index) => (
          <Accordion.Item
            eventKey={item.question}
            key={index}
            className="faq-question-box"
          >
            <Accordion.Header className="faq-question">
              {item.question}
            </Accordion.Header>
            <Accordion.Body className="faq-answer">
              {item.answer.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default Faq;
