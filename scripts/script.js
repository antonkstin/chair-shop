(function() {

const initialCards = [];

for (let i=1; i<=1000; i++) {
  initialCards.push({
    id: i,
    title: `Стул_${i}`,
    image: './images/chair.jpg',
    descr: 'Стул изготовлен из массива дуба, который прекрасно впишется в интерьер Вашего дома',
    price: i*10,
    available: true
  })
}

class Card {
  constructor(container) {
    this.container = container;
  }

  createTemplate(obj) {
    return `
      <div class="card">     
        <img class="card__image" src="${obj.image}" alt="image">

        <div class="card__about">
          <h2 class="card__title">${obj.title}</h2>
          <h3 class="price card__price">${obj.price} рублей</h3>
          <p class="card__description">${obj.descr}</p>
        </div>

        <div class="card__add">
          <button class="button card__button">Добавить в корзину</button>
          <p class="card__info"></p>
        </div>
      </div>
    `;
  }

  render(arr) {
    this.container.innerHTML = '';
    arr.forEach(item => {
      this.container.insertAdjacentHTML('beforeend', this.createTemplate(item));
    });
  }

  activeAdded(arr) {
    for(let elem of arr) {
      for(let item of this.container.querySelectorAll('.card')) {
        if(elem.title===item.querySelector('.card__title').textContent) {
          item.querySelector('.card__button').classList.add('card__button_active');
          item.querySelector('.card__info').innerHTML = `Добавлено: <span class="card__info-color">${elem.counter} товар(ов)`;
        }
      }
    }
  }

  cleanAllAdded() {
    this.container.querySelectorAll('.card').forEach(item => {
      item.querySelector('.card__button').classList.remove('card__button_active');
      item.querySelector('.card__info').textContent = '';
    });
  }

}



class Basket {
  constructor(container) {
    this.container = container;
    this.content = [];
    this.price = 0;
  }

  render() {
    if(!localStorage.basket || JSON.parse(localStorage.basket).length===0) {
      this.container.innerHTML = this.createTemplateBasket('Ваша корзина пуста');
    } else {
      this.content = JSON.parse(localStorage.basket);
      this.container.innerHTML = this.createTemplateBasket('Итог');
      for(let elem of this.content) {
        this.addCard(elem);
      }
    }
  }

  createTemplateBasket(total) {
    return `
              <div class="basket__items"></div>
              <p class="basket__total">${total}</p>
              <p class="price basket__total-price"></p>
              <button class="button basket__button">Заказать</button>
    `;
  }

  createTemplateCard(obj) {
    return `
      <div class="basket__card">
        <img class="basket__card-image" src="${obj.image}" alt="image">
        <h2 class="basket__card-title">${obj.title}</h2>
        <p class="basket__card-counter">x${obj.counter?obj.counter:1}</p>
        <p class="basket__card-close">+</p>
      </div>
    `;
  }

  addCard(obj) {
    this.container.querySelector('.basket__items').insertAdjacentHTML('beforeend', this.createTemplateCard(obj));
  }

  renderPrice() {
    for(let elem of this.content) {
      this.price = this.price + elem.price*elem.counter;
    }
  }

  pushContent(obj) {
    const template = {
      title: obj.title,
      price: obj.price,
      image: obj.image,
      counter: 1
    };
    this.content.push(template);
  }

  plusPrice(obj) {
    this.price = this.price + obj.price;
  }

  checkBasket() {
    if(!this.container.querySelector('.basket__card')) {
      this.container.querySelector('.basket__total').textContent = 'Ваша корзина пуста';
      this.container.querySelector('.basket__total-price').textContent = '';
      this.container.querySelector('.basket__button').style.display = 'none';
    } else {
      this.container.querySelector('.basket__total').textContent = 'Итог';
      this.container.querySelector('.basket__total-price').textContent = `${this.price} рублей`;
      this.container.querySelector('.basket__button').style.display = 'block';
    }
  }

  increaseCount(obj) {
    obj.counter++;
  }

  renderCounter(obj) {
    for(let elem of this.container.querySelectorAll('.basket__card')) {
      if(elem.querySelector('.basket__card-title').textContent===obj.title) {
        elem.querySelector('.basket__card-counter').textContent = `x${obj.counter}`;
        break;
      }
    }
  }

  removeCard(card) {
    this.container.querySelector('.basket__items').removeChild(card);
  }

  popContent(card) {
    for (let i=0; i<this.content.length; i++) {
      if(this.content[i].title===card.querySelector('.basket__card-title').textContent) {
        this.content.splice(i, 1);
        break;
      }
    }
  }

}

class Paginator {
  constructor(numb, container) {
    this.numberOfElements = numb;
    this.pageNumb = 1;
    this.container = container;
    this.quanityOfSelectors = Math.ceil(initialCards.length/this.numberOfElements);

    this.createSelectors();
    this.activeSelector();
  }

  sorting() {
    let start = (this.pageNumb-1)*this.numberOfElements;
    return initialCards.slice(start, start+this.numberOfElements);
  }

  addSelectors(num) {
    let template = '<div class="selector__page selector__page_left"></div>';
    if(typeof num!=='number') {
      for(let elem of num) {
        template = template + `<div class="selector__page">${elem}</div>`;
      }
    } else {
      for(let i=1; i<=num; i++) {
        template = template + `<div class="selector__page">${i}</div>`;
      }
    }
    template = template + '<div class="selector__page selector__page_right"></div>';
    this.container.insertAdjacentHTML('afterbegin', template);
  }

  createSelectors() {
    if (this.quanityOfSelectors>5) {
      this.container.innerHTML = '';
      this.addSelectors(this.difficultSolution(this.pageNumb));
      this.disableDots();
    } else if(this.quanityOfSelectors>1) {
      this.container.innerHTML = '';
      this.addSelectors(this.quanityOfSelectors);
    }  else {
      this.container.style.display = 'none';
    }
  }

  difficultSolution(num) {
    if(num===1) {
      return [1, 2, 3, '...', this.quanityOfSelectors];
    }
    if(num===this.quanityOfSelectors) {
      return [1, '...', this.quanityOfSelectors-2, this.quanityOfSelectors-1, this.quanityOfSelectors];
    }
    if(num>this.quanityOfSelectors/2) {
      return [1, '...', num-1, num, num+1];
    }
    return [num-1, num, num+1, '...', this.quanityOfSelectors];
  }

  activeSelector() {
    for(let elem of this.container.querySelectorAll('.selector__page')) {
      elem.classList.remove('selector__page_active');
      if(elem.textContent==this.pageNumb) {
        elem.classList.add('selector__page_active');
      }
    }
  }

  disableDots() {
    const selectors = this.container.querySelectorAll('.selector__page');
    if(selectors[2].textContent==='...') {
      selectors[2].classList.add('selector__page_disabled');
      selectors[selectors.length-3].classList.remove('selector__page_disabled');
    } else if(selectors[selectors.length-3].textContent==='...') {
      selectors[selectors.length-3].classList.add('selector__page_disabled');
      selectors[2].classList.remove('selector__page_disabled');
    }
  }
}

const card = new Card(document.querySelector('.cards-container'));
const page = new Paginator(15, document.querySelector('.selector'));
const basket = new Basket(document.querySelector('.basket'));

card.render(page.sorting());
basket.render();
basket.renderPrice();
basket.checkBasket();
card.activeAdded(basket.content);

document.querySelector('.cards-container').addEventListener('click', function(event) {
  if(event.target.classList.contains('card__button')) {
    for(let obj of basket.content) {
      if(event.target.closest('.card').querySelector('.card__title').textContent===obj.title) {
        basket.increaseCount(obj);
        basket.renderCounter(obj);
        basket.plusPrice(obj);
        basket.checkBasket();
        card.activeAdded(basket.content);
        localStorage.basket = JSON.stringify(basket.content);
        return;
      }
    }


    for(let obj of initialCards) {
      if(event.target.closest('.card').querySelector('.card__title').textContent===obj.title) {
        basket.addCard(obj);
        basket.plusPrice(obj);
        basket.pushContent(obj);
        basket.checkBasket();
        card.activeAdded(basket.content);
        localStorage.basket = JSON.stringify(basket.content);
        break;
      }
    }
  }
});

basket.container.addEventListener('click', function(event) {
  if(event.target.classList.contains('basket__card-close')) {
    basket.removeCard(event.target.closest('.basket__card'));
    basket.popContent(event.target.closest('.basket__card'));
    basket.price = 0;
    basket.renderPrice();
    basket.checkBasket();
    card.cleanAllAdded();
    card.activeAdded(basket.content);
    localStorage.basket = JSON.stringify(basket.content);
  }
});



document.querySelector('.selector').addEventListener('click', function(event){
  if(event.target.classList.contains('selector__page')) {
    if(event.target.classList.contains('selector__page_left')) {
      page.pageNumb--;
      if(page.pageNumb<1) {
        page.pageNumb = 1;
        return;
      }
    } else if(event.target.classList.contains('selector__page_right')) {
      page.pageNumb++;
      if(page.pageNumb>page.quanityOfSelectors) {
        page.pageNumb = page.quanityOfSelectors;
        return;
      }
    } else {
      page.pageNumb = Number(event.target.textContent);
    }
    card.render(page.sorting());
    page.createSelectors();
    page.activeSelector();
    card.activeAdded(basket.content);
  }
});

document.querySelector('.filter').addEventListener('change', function(){
  filter = document.querySelector('.filter');
  if(filter.value==='Цена') {
    initialCards.sort(function(a, b){
      return a.price - b.price;
    });
  } else if(filter.value==='Название') {
    initialCards.sort(function(a, b){
      return a.title > b.title ? 1 : -1;
    });
  } else {
    initialCards.sort(function(a, b){
      return a.available < b.available ? 1 : -1;
    });
  }
  card.render(page.sorting());
  basket.render();
  basket.renderPrice();
  basket.checkBasket();
  card.activeAdded(basket.content);
});

})();