from django.shortcuts import render
from django.http import HttpResponse
from .models import Client, Opinion, Project, Cont

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
        elements = request.POST.get('elements', '')
        elements = elements.split(" ")
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
        elements = request.POST.get('elements', '')
        elements = elements.split(" ")
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
        elements = request.POST.get('elements', '')
        elements = elements.split(" ")
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
        elements = request.POST.get('elements', '')
        elements = elements.split(" ")
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
            if length == 1 and elements != ['']:
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
        elif 'peek' in request.POST:
            operation = 'peek'
            truth = 'T'
        else:
            operation = 'none'
        #print("element --> "+ elements[0])
        params = {'operation': operation, 'elements': elements[0], 'truth': truth}
        
        # else: 
        #     truth = 'F'
        #     params = {'truth': truth}
    
        return render(request, 'Algomination/Stack.html', params)  
    else:
        return render(request, 'Algomination/Stack.html')                 

def SignUp(request):
    if request.method == "POST":
        if 'signup' in request.POST:
            name = request.POST.get('name', '')
            Email = request.POST.get('signupemail', '')
            password = request.POST.get('signuppassword', '')
            SignUp = Client(name = name, email = Email, password = password)
            allusers = Client.objects.values('email')
            print(allusers)
            truth = 'ok'
            for i in allusers:
                if i['email'] == Email:
                    truth = 'exist'
                    break
            if(truth != 'exist'):    
                SignUp.save()
                truth = 'ok'
            
            params = {'truth': truth}
                
        elif 'login' in request.POST:
            email = request.POST.get('loginemail', '')
            password = request.POST.get('loginpassword', '')
            allusers = Client.objects.values('email', 'password')
            truth = 'F'
            for i in allusers:
                if i['email'] == email:
                    if i['password'] == password:
                        truth = 'T'
                    else:
                         truth = 'F'
                    break;     
            params = {'truth': truth}
        return render(request, 'Algomination/Login.html', params)  
    else:
        return render(request, 'Algomination/Login.html')        

def Contact(request):
    if request.method == "POST":
        truth = 'F'
        if 'opinion' in request.POST:
            name = request.POST.get('opname', '')
            email = request.POST.get('opemail', '')
            desc = request.POST.get('opdesc', '')
            Contact = Opinion(name = name, email = email, desc = desc)
            Contact.save()
            truth = 'T'
        
        elif 'project' in request.POST:
            name = request.POST.get('prname', '')
            algo = request.POST.get('pralgo', '')
            git = request.POST.get('prgit', '')
            email = request.POST.get('premail', '')
            Contact = Project(name = name, algo = algo, git_link = git, email = email)
            Contact.save() 
            truth = 'T'   

        elif 'cont' in request.POST:
            name = request.POST.get('coname', '')
            email = request.POST.get('coemail', '')
            desc = request.POST.get('codesc', '')
            Contact = Cont(name = name, email = email, desc = desc)
            Contact.save()
            truth = 'T'
        
        params = {'truth': truth}
        return render(request, 'Algomination/Contact.html', params)
    else:
        return render(request, 'Algomination/Contact.html')        