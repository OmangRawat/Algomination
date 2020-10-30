from django.shortcuts import render
from django.http import HttpResponse
from .models import Card

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

        print(opt)

        if len(num) == 0:
            num = '0'
        

        elements = elements.split(" ")

        elements = [float(x) for x in elements]

        if opt == '2':
            # elements = [int(x) for x in elements.split()]
            elements = sorted(elements)
            # print('Sorted')

        tempele = []
        for x in elements:
            if int(x) == x:
                tempele.append(f"{int(x)}")
            else:
                tempele.append(f"{x}")

        elements = tempele

        # print(num)
        print(elements)
        if int(num) == len(elements) and ele != '' and 1 <= (num and len(elements)) <= 20:
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

def BubbleSort(request):
    if request.method == "POST":
        elements = request.POST.get('elements', '');
        elements = elements.split(" ");
        length = len(elements)

        if length > 10:
            truth = 'F'
            params = {'truth': truth}

        else:
            truth = 'T'
            elements = [float(x) for x in elements]
            tempele = []
            for x in elements:
                if int(x) == x:
                    tempele.append(f"{int(x)}")
                else:
                    tempele.append(f"{x}")

            elements = tempele
            params = {'elements': elements, 'num': length, 'truth': truth}

        
        return render(request, 'Algomination/BubbleSort.html', params)
    else:
        return render(request, 'Algomination/BubbleSort.html')

def SelectionSort(request):
    if request.method == "POST":
        elements = request.POST.get('elements', '');
        elements = elements.split(" ");
        length = len(elements)

        if length > 10:
            truth = 'F'
            params = {'truth': truth}

        else:
            truth = 'T'
            elements = [float(x) for x in elements]
            tempele = []
            for x in elements:
                if int(x) == x:
                    tempele.append(f"{int(x)}")
                else:
                    tempele.append(f"{x}")

            elements = tempele
            params = {'elements': elements, 'num': length, 'truth': 'T'}

        return render(request, 'Algomination/SelectionSort.html', params)
    else:
        return render(request, 'Algomination/SelectionSort.html')

def InsertionSort(request):
    if request.method == "POST":
        elements = request.POST.get('elements', '');
        elements = elements.split(" ");
        length = len(elements)

        if length > 10:
            truth = 'F'
            params = {'truth': truth}

        else:
            elements = [float(x) for x in elements]
            tempele = []
            for x in elements:
                if int(x) == x:
                    tempele.append(f"{int(x)}")
                else:
                    tempele.append(f"{x}")

            elements = tempele
            params = {'elements': elements, 'num': length, 'truth': 'T'}

        return render(request, 'Algomination/InsertionSort.html', params)
    else:
        return render(request, 'Algomination/InsertionSort.html')

def Stack(request):
    if request.method == "POST":
        elements = request.POST.get('elements', '');
        elements = elements.split(" ");
        length = len(elements)

        
        # if length == 1:
        #     truth = 'T'
        #     elements = [float(x) for x in elements]
        #     tempele = []
        #     for x in elements:
        #         if int(x) == x:
        #             tempele.append(f"{int(x)}")
        #         else:
        #             tempele.append(f"{x}")

        #     elements = tempele
        
        if 'push' in request.POST:
            if length == 1:
                truth = 'T'
                elements = [float(x) for x in elements]
                tempele = []
                for x in elements:
                    if int(x) == x:
                        tempele.append(f"{int(x)}")
                    else:
                        tempele.append(f"{x}")

                elements = tempele
            else: 
                truth = 'F'
                params = {'truth': truth}    
            operation = 'push'
        elif 'pop' in request.POST:
            operation = 'pop'
            truth = 'T'
        else:
            operation = 'peek'
        #print("element --> "+ elements[0])
        params = {'operation': operation, 'elements': elements[0], 'truth': truth}
        
        # else: 
        #     truth = 'F'
        #     params = {'truth': truth}
    
        return render(request, 'Algomination/Stack.html', params)  
    else:
        return render(request, 'Algomination/Stack.html')                 