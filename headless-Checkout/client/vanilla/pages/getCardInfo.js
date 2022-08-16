//local-server url and token
//replace this url with your local-server url
const server = "http://localhost:8080";
//replace token with client id
const token = "sbx_ci_7kCbmGnJBYmC4TwUz1FA3FsWPnRKQG3gzCX4R87VDTsS";
const country = "USA";

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
    const url = `${server}/create`;
    const options = {
      method: "POST",
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        let order_id = (data.id);
        const card_number = document.getElementById("card_number").value;
        let inaiInstance = window.inai.create({
          token: token,
          orderId: order_id,
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