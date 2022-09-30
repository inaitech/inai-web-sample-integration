const serverUrl = "http://localhost:5999";
const token = "<token>";
const country = "<country>";
const externalId = "<externalId>";
const currency = "<currency>";
const amount = "<amount>";

const createElement = (tag, id) => {
  const elem = document.createElement(tag);
  if (!!id) {
    elem.id = id;
  }
  return elem;
};

function debounce(callback, delay) {
  let timeout;  
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  }

}

const response_display = document.getElementById('response');
const input_box = document.getElementById('card_number');

input_box.oninput = (e) => {
  if ((e.target.value.length) >= 6) {
    debounce(cardInfo(), 1500);
  }

  function cardInfo() {
    const url = `${serverUrl}/v1/orders`;
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        amount,
        currency,
        customer: {
          external_id: externalId,
        }
      })
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        let orderId = (data.id);
        const card_number = document.getElementById("card_number").value;
        let inaiInstance = window.inai.create({
          token: token,
          orderId: orderId,
          countryCode: country,
        });
        inaiInstance.getCardInfo(card_number)
          .then((res) => {
            response_display.textContent = (JSON.stringify(res));
          }).catch((error) => {
            response_display.textContent = (JSON.stringify(error));
          });
      });
  }
}