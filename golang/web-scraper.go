package lib_concurr

import (
    "net/http"
    "io/ioutil"
)

type Obj struct {
    Url string
    Result string
    Id int
}

type Req struct {
    Objs []Obj
    Callback func(str string) string
}

func makeRequest(url string, ch chan Obj, id int, callback func(str string) string) {
    resp, err := http.Get(url)
    if err != nil {
        panic("\nCheck your Internet connection.\n")
    }
    defer resp.Body.Close()
    body, _ := ioutil.ReadAll(resp.Body)
    str := string(body)
    str = callback(str)
    ch <- Obj{url, str, id}
}

func (req *Req) Concurr() {
    if req.Callback == nil {
        // default function
        req.Callback = func (str string) string {
		    return str
	    }
    }
    ch := make(chan Obj)
    var i int
    for _, o := range req.Objs {
        go makeRequest(o.Url, ch, i, req.Callback)
        i++
    }

    var elt Obj
    for range req.Objs {
        elt = <- ch
        req.Objs[elt.Id] = elt
    }
}