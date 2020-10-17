from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    return render(request, 'Algomination/try4.html')

def search(request):
#   return render(request, 'Algomination/search.html')
    if request.method == "POST":
        num = request.POST.get('num', '0')
        elements = request.POST.get('elements', '')
        opt = request.POST.get('opt', '0')
        ele = request.POST.get('ele', '')


        elements = elements.split(" ")

        print(num)
        print(elements)
        if int(num) == len(elements):
            truth = 'T'
            flag = 0
            for i in elements:
                if i == ele:
                    index = elements.index(i)
                    flag = 1
                    break

            if flag == 0:
                index = -1

            params = {'index' : index, 'elements' : elements, 'ele': ele, 'opt' : opt, 'truth': truth, 'num': num}

        else:
            truth = 'F'
            params = {'truth': truth}
        return render(request, 'Algomination/search.html', params)
        
    else:
        return render(request, 'Algomination/search.html')