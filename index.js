
(function () {

    const highLightElement = function (element) {
        const tdElements = document.querySelectorAll(`td[data-ele="${element}"]`);
        tdElements.forEach(tdElement => tdElement.classList.add('selected'));
    };

    const resetHighLightedElements = function () {
        const tdElements = document.querySelectorAll(`td.selected`);
        tdElements.forEach(tdElement => tdElement.classList.remove('selected'));
    };

    // for track element index for range selection
    let startIndex = null, endIndex = null;

    /**
     * td on click event handler
     *
     * @param {event} ev
     */
    const onElementClick = function (ev) {
        const ele = ev.target.dataset.ele;
        resetHighLightedElements();

        if (startIndex) {
            endIndex = parseInt(ele, 10);
            if (endIndex < startIndex) {
                const temp = startIndex;
                startIndex = endIndex;
                endIndex = temp;
            }
            for (let i = startIndex; i <= endIndex; i++) {
                highLightElement(i);
            }
            endIndex = null;
            startIndex = null;
        } else {
            startIndex = parseInt(ele, 10);
            highLightElement(ele);
        }
    };

    /**
     * render eleArray and append to domId element
     *
     * @param {Array} eleArray
     * @param {String} domId
     * @param {Integer} chunkSize
     */
    const appendDataToDom = function (eleArray, domId, chunkSize = 20) {
        for (let index = 0; index < eleArray.length; index += chunkSize) {
            myChunk = eleArray.slice(index, index + chunkSize);
            const tr = document.createElement('tr');
            myChunk.forEach(function (ele, ind) {
                const td = document.createElement('td');
                td.innerText = ele;
                td.dataset.ele = index + ind;
                td.addEventListener('click', onElementClick);
                tr.append(td);
            });
            document.getElementById(domId).append(tr);
        }
    };

    /**
     * Reset tables elements
     *
     */
    const clearTables = function () {
        document.getElementById('hex-block').innerHTML = "";
        document.getElementById('ascii-block').innerHTML = "";
    }

    /**
     * create array buffer from file object
     *
     * @param {File} fileObj
     */
    const getArrayBufferFromFile = function (fileObj) {
        return new Promise(function (res, rej) {
            var reader = new FileReader();
            reader.onload = function() {
                res(this.result);
            };
            reader.onerror = rej;
            reader.readAsArrayBuffer(fileObj);
        });
    };

    /**
     * 1) Convert File Array Buffer to hex array
     * 2) create hex data table and append to dom
     * 3) convert hex array to ascii value
     * 4) create ascii data table and append to dom
     *
     * @param {Array} buffer
     */
    const createDataTables = function (buffer) {
        clearTables();
        const hexArray = Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2));
        appendDataToDom(hexArray, 'hex-block');
        const asciiArray = hexArray.map(hax => String.fromCharCode(parseInt(hax, 16)));
        appendDataToDom(asciiArray, 'ascii-block');
    };

    /**
     * file change event hendler
     *
     * @param {event} ev
     */
    const onFileChange = function (ev) {
        const { files } = ev.target;
        if (!files.length) {
            return;
        }
        const file = files[0];
        const fileSize = file.size;
        const filePath = ev.target.value;

        document.getElementById('file-path').innerText = `File Path: ${filePath}`;
        document.getElementById('file-size').innerText = `File Size: ${fileSize}`;

        getArrayBufferFromFile(file)
            .then(createDataTables)
            .catch(() => window.alert(`Error in reading file - ${filePath}`));
    };

    document.getElementById('file-uploader').addEventListener('change', onFileChange);
})();
