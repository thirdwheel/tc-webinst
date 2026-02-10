let Installer={
    init()
    {
        let next = document.querySelectorAll('button.btn-next');
        for (let i = 0; i < next.length; i++)
        {
            next[i].onclick=Installer.next[next[i].parentElement.id];
        }
        let prev = document.querySelectorAll('button.btn-prev');
        for (let i = 0; i < prev.length; i++)
        {
            prev[i].onclick=Installer.prev[prev[i].parentElement.id];
        }
    },
    next: {
        stage1()
        {
            let checked = document.querySelector('input[name="instfrom"]:checked');
            if (checked !== null)
            {
                document.getElementById('stage1').style.display='none';
                document.getElementById('stage2' + checked.value).style.display='block';
                let ajax = Installer.snippets.ajax();

                switch (checked.value)
                {
                    case 'N':
                        ajax.open('GET', '/cgi-bin/getarch.sh');
                        ajax.onloadend=function()
                        {
                            let arch = document.querySelector('#stage2N .' + this.response.arch);
                            if (arch === null)
                            {
                                arch = document.querySelector('#stage2N .noarch');
                            }
                            arch.style.display='inherit';
                        }
                        ajax.send(null);
                        break;
                    case 'C':
                        document.querySelector('#stage2C .cdroms').innerHTML='Loading CDs...';
                        ajax.open('GET', '/cgi-bin/find-cdrom.sh');
                        ajax.onloadend=function()
                        {
                            let cdroms=document.querySelector('#stage2C .cdroms');
                            cdroms.innerHTML='';

                            if (this.response.error !== undefined)
                            {
                                switch (this.response.error)
                                {
                                    case 1:
                                        cdroms.innerHTML='Could not find valid CDs: ' + this.response.detail;
                                        break;
                                    case 2:
                                        cdroms.innerHTML='Could not find valid CDs!';
                                }
                                return;
                            }
                            for (let i = 0; i < this.response.cds.length; i++)
                            {
                                let cd=this.response.cds[i];
                                let label = document.createElement('label');
                                let input = label.appendChild(document.createElement('input'));
                                input.type='radio';
                                input.name='cdrom';
                                input.value=cd;
                                label.appendChild(document.createTextNode(' ' + cd));
                                cdroms.appendChild(label);
                            }
                        }
                        ajax.send();

                        break;
                }
            }
        },
        stage2R()
        {},
        stage2C()
        {},
        stage2I()
        {},
        stage2N()
        {},
    },
    prev: {
        stage2R()
        {
            document.getElementById('stage2R').style.display='none';
            document.getElementById('stage1').style.display='block';
        },
        stage2C()
        {
            document.getElementById('stage2C').style.display='none';
            document.getElementById('stage1').style.display='block';
        },
        stage2I()
        {
            document.getElementById('stage2I').style.display='none';
            document.getElementById('stage1').style.display='block';
        },
        stage2N()
        {
            document.getElementById('stage2N').style.display='none';
            document.getElementById('stage1').style.display='block';
        },
    },
    snippets: {
        ajax()
        {
            let x = new XMLHttpRequest();
            x.responseType='json';
            return x;
        }
    }
}

window.addEventListener('load', Installer.init);