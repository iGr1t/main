const cols = document.querySelectorAll('.col')

//Меняем цвет с помощью пробела
document.addEventListener('keydown',(event)=>{
    event.preventDefault()// чтобы не менялась иконка замка при нажатии на пробел
    if(event.code=== 'Space'){
        setRandomColors() 
    }
})

//Меняем по клику мыши замок
//Чтобы поменялась кнопка замка,нам надо менять тег i, но мы можем нажать не только по кнопке
// но и по иконке, поэтому мы создаем константу node
document.addEventListener('click',(event) =>{
    const type = event.target.dataset.type // создаем константу замка
    if (type==='lock') { //Необходимо написать условие,чтобы при клике на иконку и ореол вокруг иконки
        // у нас был class i,чтобы потом менять замок
        const node = event.target.tagName.toLowerCase() === 'i'
        ? event.target
        : event.target.children[0] //Если была кнопка,то получаем первого ребенка у этой кнопки
        // т.е. class i
        //Делаем тогл для пеключения иконки замка
        node.classList.toggle('fa-lock-open')
        node.classList.toggle('fa-lock')

        console.log(event.target.tagName)//Показывает адрес клика
    } else {
        copyToClickboard(event.target.textContent)
    }
})

//ФУункция,которая копирует текст при клике
function copyToClickboard(text) {
    return navigator.clipboard.writeText(text)
}

//Функция, которая будет возвращать рандомный цвет.
// Всю эту функцию можно заменить библиотекой chroma и вызвать chroma.random()
function generateRandomColor() {
    //RGB
    //#FF0000 - Red
    //#00FF00 - Green
    //#0000FF - Blue
    // В hexCodes все возможные символы цветов
    const hexCodes = '0123456789ABCDEF'
    let color = ''
    //создадим цикл,который будет возвращать 6 рандомных символов из заданного
    for (let i=0;i < 6;i++) {
        color += hexCodes[Math.floor(Math.random()* hexCodes.length)]
    }
    return '#' + color
}

//Применяем к каждой колонке рандомный цвет и присваиваем тексту и замку белый или черн цвет
function setRandomColors(isInitial) {
    const colors = isInitial ? getColorFromHash() : []// Создаем для функции updateColorsHash,чтобы записывать названия
        //цветов в адресную строку через тире

    cols.forEach((col,index) => {
        //isLocked создаем ,чтобы потом заблокировать цвет при закрытом замке
        const isLocked = col.querySelector('i').classList.contains('fa-lock')
        const text = col.querySelector('h2')
        const button = col.querySelector('button')

        //Это позволит заблокировать цвет при закрытом замке
        if(isLocked) {
            colors.push(text.textContent)
            return
        }

        const color = isInitial 
        ? colors[index]
            ?colors[index]
            :chroma.random()
         : chroma.random()

        if(!isInitial) {
        colors.push(color)
        }
        

        text.textContent = color // меняем Text на название цвета
        col.style.background = color
        setTextColor (text,color)
        setTextColor (button,color)
    })

    updateColorsHash (colors)
}

//функция меняющая цвет текста,чтобы он не сливался с основным цветом
function setTextColor (text,color) {
    const luminance =  chroma(color).luminance()
    text.style.color = luminance > 0.5 ? 'black' : 'white' 
}

function updateColorsHash (colors = []) {
    document.location.hash = colors
    .map((col)=> {
        return col.toString().substring(1)
    })
    .join('-')
}

//Функция,которая будет отображать цвет,который в хеше
//Преобразуем строку в массив
function getColorFromHash() {
    if (document.location.hash.length > 1) {
        return document.location.hash
        .substring(1)
        .split('-')
        .map((color)=> '#' + color)
    }
    return []
}


setRandomColors(true)