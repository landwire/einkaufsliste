import React, { useState, useEffect } from 'react';
import './App.css';

function App () {
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');

    const doneCount = items.filter((item) => item.done).length;
    const totalCount = items.length;

    // email
    const emailSubject = 'Einkaufsliste';
    const emailBody = encodeURIComponent(items.map((item) => item.name).join('\n'));
    const mailtoLink = `mailto:?subject=${emailSubject}&body=${emailBody}`;

    useEffect(() => {
        // Load items from localStorage
        const storedItems = JSON.parse(localStorage.getItem('shoppingListItems')) || [];
        setItems(storedItems);
    }, []);

    useEffect(() => {
        // Save items to localStorage whenever items change
        localStorage.setItem('shoppingListItems', JSON.stringify(items));
    }, [items]);

    const handleInputChange = (e) => {
        setItemName(e.target.value);
        setErrorMessage('');
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddItem();
        }
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setQuantity(value);
    };

    const isFirstLetterUppercase = (str) => {
        const firstChar = str.charAt(0);
        return /^[A-Z]$/.test(firstChar);
    };

    const handleAddItem = () => {
        if (itemName.trim() !== '' && isFirstLetterUppercase(itemName)) {
            // create an array of newItems from input fields (quantity & text)
            const newItems = Array.from({ length: quantity }, () => ({
                name: itemName,
                done: false
            }));

            // add newItems to existing items
            setItems([...items, ...newItems]);

            // reset values in input fields
            setItemName('');
            setQuantity(1);
        } else {
            setErrorMessage('Der Artikel muss mit einem großen Anfangsbuchstaben beginnen.');
        }
    };

    // war nicht verlangt, macht aner denke ich Sinn, falls man sich mal vertan hat
    const handleRemoveItem = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };

    const handleEmptyList = () => {
        setItems([]);
    };

    const handleToggleDone = (index) => {
        const updatedItems = [...items];
        // Erlaube rückgängig machen, falls man aus Versehen einen Eintrag als "done" markiert hat
        updatedItems[index].done = !updatedItems[index].done;
        setItems(updatedItems);
    };

    return (
        <div className="app">
            <header>
                <h1 className="app__title">Einkaufsliste</h1>
            </header>
            <main>
                <section className="listHeader">
                    <div className="inputFields">
                        <input
                            className="inputField itemQuantity"
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            max="20"
                        />
                        <span className="times">+</span>
                        <input
                            className="inputField itemName"
                            type="text"
                            placeholder="Artikel"
                            value={itemName}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                        />
                    </div>
                    <button className="button" onClick={handleAddItem}>Hinzufügen<span className="icon">+</span></button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </section>
                <section className="listMain">
                    <ul>
                        {items.map((item, index) => (
                            <li
                                key={index}
                                className={item.done ? 'done' : ''}
                                onClick={() => handleToggleDone(index)}
                            >
                                {item.name}
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveItem(index);
                                }}><span className="visuallyHidden">Artikel entfernen</span>x
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="listFooter">
                    {totalCount > 0 && (
                        <p className="itemsLeft">
                            Noch {totalCount - doneCount} von {totalCount} Einträgen
                        </p>
                    )}
                    {totalCount > 0 && (
                        <button className="button" onClick={handleEmptyList}>Liste leeren<span className="icon">+</span></button>
                    )}
                    {totalCount > 0 && (
                        <a className="button" href={mailtoLink}>Einkaufsliste als E-Mail schicken</a>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;
